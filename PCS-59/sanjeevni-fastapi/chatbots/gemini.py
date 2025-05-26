from typing import Dict, List, Any
from config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    logger,
    get_system_prompt,
    MAX_CONVERSATION_HISTORY,
)
from tools import tool_registry
from chatbots.base import BaseChatbot
import json
import base64

# Import the Google Generative AI client and types
from google import genai
from google.genai import types


class GeminiChatbot(BaseChatbot):
    """
    A chatbot powered by Google's Gemini API with tool calling capabilities.
    """

    def __init__(self, database_path: str = "conversations.db"):
        """
        Initialize the Gemini chatbot.

        Args:
            database_path: Path to the conversation database file
        """
        super().__init__(database_path)
        self.model_name = GEMINI_MODEL

        # Initialize the Gemini client with the API key
        self.client = genai.Client(api_key=GEMINI_API_KEY)

        # Get available tools and convert to Tool objects
        self._prepare_tools()

    def _prepare_tools(self):
        """
        Prepare tools in the format expected by the Gemini client.
        """
        # Get tool definitions from the registry
        function_declarations = tool_registry.get_tool_definitions()

        # Create Tool object if we have function declarations
        if function_declarations:
            self.tools = types.Tool(function_declarations=function_declarations)
            self.config = types.GenerateContentConfig(
                tools=[self.tools], system_instruction=get_system_prompt()
            )
        else:
            self.tools = None
            self.config = types.GenerateContentConfig(
                system_instruction=get_system_prompt()
            )

    def _prepare_messages(self, conversation_id: str) -> List[types.Content]:
        """
        Prepare messages for the Gemini API from the conversation history.

        Args:
            conversation_id: ID of the conversation

        Returns:
            List of Content objects in the format expected by Gemini
        """
        history = self.database.get_conversation(conversation_id)

        # Limit history to the last MAX_CONVERSATION_HISTORY messages
        if len(history) > MAX_CONVERSATION_HISTORY:
            logger.info(
                f"Limiting conversation history to last {MAX_CONVERSATION_HISTORY} messages"
            )
            history = history[-MAX_CONVERSATION_HISTORY:]

        # Convert the conversation history to Content objects
        contents = []
        for message in history:
            role = "user" if message["role"] == "user" else "model"
            contents.append(
                types.Content(role=role, parts=[types.Part(text=message["content"])])
            )

        return contents

    async def _get_audio_buffer(self, text: str, lang: str = "hi") -> bytes:
        """
        Get audio buffer for text-to-speech conversion using free TTS libraries.
        Also saves the audio file to the audio directory.
        
        Args:
            text: The text to convert to speech
            lang: The language code (default: "hi" for Hindi)
            
        Returns:
            A bytes object containing the audio data
        """
        try:
            # Ensure audio directory exists
            import os
            audio_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "audio")
            os.makedirs(audio_dir, exist_ok=True)
            
            # Generate a unique filename based on timestamp and text hash
            import time
            import hashlib
            text_hash = hashlib.md5(text.encode()).hexdigest()[:8]
            timestamp = int(time.time())
            filename = f"{timestamp}_{text_hash}_{lang}.mp3"
            filepath = os.path.join(audio_dir, filename)
            
            # Try using gTTS (Google Text-to-Speech) first
            # This doesn't require a Google Cloud subscription
            from gtts import gTTS
            import io
            
            logger.info(f"Converting text to speech using gTTS. Language: {lang}")
            
            # Create gTTS object
            tts = gTTS(text=text, lang=lang, slow=False)
            
            # Save to file
            tts.save(filepath)
            logger.info(f"Saved audio file to {filepath}")
            
            # Read the file into a buffer to return
            with open(filepath, 'rb') as f:
                audio_data = f.read()
            
            # Return the audio content as bytes
            return audio_data
            
        except Exception as e:
            logger.warning(f"Error using gTTS: {e}. Falling back to pyttsx3.")
            return await self._fallback_tts(text, lang)
    
    async def _fallback_tts(self, text: str, lang: str = "hi") -> bytes:
        """
        Fallback TTS method using pyttsx3 (offline text-to-speech engine).
        Also saves the audio file to the audio directory.
        
        Args:
            text: The text to convert to speech
            lang: The language code
            
        Returns:
            A bytes object containing the audio data
        """
        try:
            import pyttsx3
            import os
            import time
            import hashlib
            
            logger.info("Using pyttsx3 fallback for text-to-speech")
            
            # Ensure audio directory exists
            audio_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "audio")
            os.makedirs(audio_dir, exist_ok=True)
            
            # Generate a unique filename
            text_hash = hashlib.md5(text.encode()).hexdigest()[:8]
            timestamp = int(time.time())
            filename = f"{timestamp}_{text_hash}_{lang}.wav"
            filepath = os.path.join(audio_dir, filename)
            
            # Initialize the TTS engine
            engine = pyttsx3.init()
            
            # Try to set a voice based on language code (if available)
            voices = engine.getProperty('voices')
            for voice in voices:
                # This is a rough approximation - voice IDs vary by system
                if lang in voice.id.lower():
                    engine.setProperty('voice', voice.id)
                    break
            
            # Set properties
            engine.setProperty('rate', 150)  # Speed of speech
            
            # Save to file
            engine.save_to_file(text, filepath)
            engine.runAndWait()
            logger.info(f"Saved audio file to {filepath}")
            
            # Read the saved file and return its contents
            with open(filepath, 'rb') as f:
                audio_data = f.read()
            
            return audio_data
                        
        except Exception as e:
            logger.error(f"Error in fallback TTS: {e}", exc_info=True)
            logger.warning("All TTS methods failed. Returning empty audio buffer.")
            return bytes()

    def _get_lipsync_data(self) -> dict:
        """
        Get lipsync data for the response.
        """
        return {
                "metadata": {"soundFile": "/audios/api_1.wav", "duration": 5.32},
                "mouthCues": [
                    {"start": 0.00, "end": 0.77, "value": "X"},
                    {"start": 0.77, "end": 0.85, "value": "B"},
                    {"start": 0.85, "end": 0.99, "value": "E"},
                    {"start": 0.99, "end": 1.41, "value": "F"},
                    {"start": 1.41, "end": 1.55, "value": "B"},
                    {"start": 1.55, "end": 1.63, "value": "A"},
                    {"start": 1.63, "end": 1.70, "value": "C"},
                    {"start": 1.70, "end": 1.83, "value": "F"},
                    {"start": 1.83, "end": 1.97, "value": "G"},
                    {"start": 1.97, "end": 2.04, "value": "C"},
                    {"start": 2.04, "end": 2.18, "value": "B"},
                    {"start": 2.18, "end": 2.25, "value": "C"},
                    {"start": 2.25, "end": 2.60, "value": "B"},
                    {"start": 2.60, "end": 2.67, "value": "C"},
                    {"start": 2.67, "end": 2.88, "value": "B"},
                    {"start": 2.88, "end": 3.02, "value": "C"},
                    {"start": 3.02, "end": 3.23, "value": "B"},
                    {"start": 3.23, "end": 3.31, "value": "A"},
                    {"start": 3.31, "end": 3.80, "value": "B"},
                    {"start": 3.80, "end": 3.87, "value": "C"},
                    {"start": 3.87, "end": 4.01, "value": "H"},
                    {"start": 4.01, "end": 4.08, "value": "B"},
                    {"start": 4.08, "end": 4.29, "value": "C"},
                    {"start": 4.29, "end": 4.38, "value": "A"},
                    {"start": 4.38, "end": 4.42, "value": "B"},
                    {"start": 4.42, "end": 4.60, "value": "C"},
                    {"start": 4.60, "end": 4.74, "value": "B"},
                    {"start": 4.74, "end": 4.87, "value": "X"},
                    {"start": 4.87, "end": 4.93, "value": "B"},
                    {"start": 4.93, "end": 4.98, "value": "C"},
                    {"start": 4.98, "end": 5.19, "value": "B"},
                    {"start": 5.19, "end": 5.32, "value": "X"},
                ],
            }
        

    async def send_message(
        self,
        conversation_id: str,
        message: str,
        lang: str = "en",
        max_tool_call_depth: int = 10,
    ) -> Dict[str, Any]:
        """
        Send a message to the chatbot and get a response.

        Args:
            conversation_id: The ID of the conversation
            message: The message to send
            lang: Language for TTS (default: "en")
            max_tool_call_depth: Maximum depth of recursive tool calls (default: 10)

        Returns:
            A dictionary containing the response and conversation ID
        """
        logger.info(f"Processing message for conversation: {conversation_id}")

        # Validate message is not empty
        if not message or message.strip() == "":
            logger.error("Empty message provided")
            raise ValueError("Message cannot be empty")

        # Get conversation history
        conversation = self.database.get_conversation(conversation_id)

        # Add user message to conversation
        self.database.add_message(conversation_id, "user", message)

        try:
            # Prepare messages for the API
            contents = self._prepare_messages(conversation_id)

            # Create the model
            model = self.client.models

            # Generate response
            response = model.generate_content(
                model=self.model_name, contents=contents, config=self.config
            )
            
            print(response)
            
            token_usage = {
                "prompt_tokens": response.usage_metadata.prompt_token_count,
                "total_tokens": response.usage_metadata.total_token_count,
            }

            # Check if there are function calls in the response
            function_calls = []
            if hasattr(response, "candidates") and response.candidates:
                for candidate in response.candidates:
                    if hasattr(candidate, "content") and candidate.content:
                        for part in candidate.content.parts:
                            if hasattr(part, "function_call") and part.function_call:
                                function_calls.append(
                                    {
                                        "name": part.function_call.name,
                                        "args": json.loads(part.function_call.args),
                                    }
                                )

            # Process function calls if any
            if function_calls:
                logger.info(f"Found {len(function_calls)} function calls in response")

                # Process the function calls
                function_results = self._process_tool_calls(function_calls)

                # Handle the results of the function calls
                result = self._handle_tool_results(
                    message,
                    function_calls,
                    function_results,
                    max_tool_call_depth,
                    total_tokens=token_usage,
                )

                response_text = result["response_text"]
                token_usage = result["token_usage"]
            else:
                # No function calls, just get the text response
                response_text = response.text

            # Add assistant response to conversation
            self.database.add_message(conversation_id, "assistant", response_text)

            # Get audio buffer
            audio_buffer = await self._get_audio_buffer(response_text, lang)

            # Format response in the requested structure
            messages = [
                {
                    "message": response_text,
                    "audio": base64.b64encode(audio_buffer).decode("utf-8"),
                    "lipsync": self._get_lipsync_data(),
                    "facialExpression": "smile",  # Default expression
                    "animation": "Talking",  # Default animation
                }
            ]

            return {"messages": messages, "token_usage": token_usage}

        except Exception as e:
            logger.error(f"Error generating response: {e}", exc_info=True)
            error_message = f"I encountered an error: {str(e)}"

            # Add error message to conversation
            self.database.add_message(conversation_id, "assistant", error_message)

            # Create an empty audio buffer for the error message
            try:
                audio_buffer = await self._get_audio_buffer(error_message, lang)
            except Exception as audio_error:
                logger.error(f"Error generating audio for error message: {audio_error}")
                audio_buffer = bytes()  # Empty buffer if audio generation fails

            # Format error response in the same structure as successful responses
            messages = [
                {
                    "message": error_message,
                    "audio": base64.b64encode(audio_buffer).decode("utf-8"),
                    "lipsync": self._get_lipsync_data(),
                    "facialExpression": "concerned",  # Use a concerned expression for errors
                    "animation": "Idle",  # Use a neutral animation for errors
                }
            ]

            return {
                "messages": messages,
                "token_usage": {"prompt_tokens": 0, "total_tokens": 0}
            }

    def _handle_tool_results(
        self,
        original_message: str,
        function_calls: List[Dict],
        function_results: List[Dict],
        max_depth: int,
        recursive_calls: List[Dict] = None,
        total_tokens: Dict[str, int] = None,
    ) -> Dict[str, Any]:
        """
        Handle tool results and process any recursive function calls.

        Args:
            original_message: The original user message
            function_calls: The function calls made
            function_results: The results of the function calls
            max_depth: Maximum depth of recursive tool calls
            recursive_calls: List of previous recursive calls
            total_tokens: Token usage tracking

        Returns:
            A dictionary containing the response text and token usage
        """
        if max_depth <= 0:
            logger.warning("Maximum tool call depth reached")
            return {
                "response_text": "I've reached the maximum depth of tool calls and cannot process further.",
                "token_usage": total_tokens
                or {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
            }

        if recursive_calls is None:
            recursive_calls = []

        if total_tokens is None:
            total_tokens = {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0,
            }

        try:
            # Prepare the message with function results
            tool_message = "I'll help you with that. Let me use some tools to get the information you need."

            # Add function calls and results to the message
            for i, (call, result) in enumerate(zip(function_calls, function_results)):
                tool_name = call["name"]
                tool_message += f"\n\nTool: {tool_name}\n"
                tool_message += f"Parameters: {json.dumps(call['args'], indent=2)}\n"
                tool_message += f"Result: {json.dumps(result['response'], indent=2)}"

            # Create a new conversation to get the final response
            messages = [
                types.Content(role="user", parts=[types.Part(text=original_message)]),
                types.Content(role="model", parts=[types.Part(text=tool_message)]),
                types.Content(
                    role="user",
                    parts=[
                        types.Part(
                            text="Please provide a helpful response based on the tool results above."
                        )
                    ],
                ),
            ]

            # Add any recursive calls to the conversation
            for call in recursive_calls:
                messages.append(
                    types.Content(
                        role="model", parts=[types.Part(text=call["message"])]
                    )
                )

            # Generate the final response
            model = self.client.get_model(self.model_name)
            response = model.generate_content(
                contents=messages, generation_config=self.config
            )

            # Update token usage
            current_call = {
                "token_usage": {
                    "prompt_tokens": response.usage_metadata.prompt_token_count,
                    "total_tokens": response.usage_metadata.total_token_count,
                    "completion_tokens": response.usage_metadata.total_token_count
                    - response.usage_metadata.prompt_token_count,
                }
            }

            total_tokens["prompt_tokens"] += current_call["token_usage"][
                "prompt_tokens"
            ]
            total_tokens["completion_tokens"] += current_call["token_usage"][
                "completion_tokens"
            ]
            total_tokens["total_tokens"] += current_call["token_usage"]["total_tokens"]

            response_text = response.text

            # Check if there are more function calls in the response
            new_function_calls = []
            if hasattr(response, "candidates") and response.candidates:
                for candidate in response.candidates:
                    if hasattr(candidate, "content") and candidate.content:
                        for part in candidate.content.parts:
                            if hasattr(part, "function_call"):
                                new_function_calls.append(
                                    {
                                        "name": part.function_call.name,
                                        "args": json.loads(part.function_call.args),
                                    }
                                )

            # Process any new function calls recursively
            if new_function_calls:
                logger.info(
                    f"Found {len(new_function_calls)} more function calls in response"
                )

                # Add this call to the recursive calls list
                recursive_calls.append(
                    {"message": response_text, "function_calls": new_function_calls}
                )

                # Process the new function calls
                new_function_results = self._process_tool_calls(new_function_calls)

                # Handle the results recursively
                result = self._handle_tool_results(
                    original_message,
                    new_function_calls,
                    new_function_results,
                    max_depth - 1,
                    recursive_calls,
                    total_tokens,
                )
                return result

            logger.info(f"Returning final response from depth {max_depth}")
            return {
                "response_text": response_text,
                "token_usage": current_call["token_usage"],
            }

        except Exception as e:
            logger.error(f"Error handling tool results: {e}", exc_info=True)
            # Return whatever text we have if there's an error
            return {
                "response_text": f"I encountered an error processing the tool results: {str(e)}",
                "token_usage": current_call["token_usage"],
            }

    def _prepare_conversation_history(
        self, conversation: List[Dict]
    ) -> List[types.Content]:
        """
        Prepare the conversation history for the Gemini API.

        Args:
            conversation: The conversation history

        Returns:
            List of Content objects in the format expected by Gemini
        """
        # Limit history to the last MAX_CONVERSATION_HISTORY messages
        if len(conversation) > MAX_CONVERSATION_HISTORY:
            logger.info(
                f"Limiting conversation history to last {MAX_CONVERSATION_HISTORY} messages"
            )
            conversation = conversation[-MAX_CONVERSATION_HISTORY:]

        contents = []
        for message in conversation:
            role = "user" if message["role"] == "user" else "model"
            # Ensure content is not empty
            content = message["content"]
            if not content or content.strip() == "":
                logger.warning(f"Skipping empty message with role {role}")
                continue

            contents.append(types.Content(role=role, parts=[types.Part(text=content)]))

        return contents

    def _process_tool_calls(self, function_calls: List[Dict]) -> List[Dict]:
        """
        Process tool calls and get results.

        Args:
            function_calls: The function calls to process

        Returns:
            List of results for the function calls
        """
        results = []
        for call in function_calls:
            tool_name = call["name"]
            args = call["args"]

            try:
                # Execute the tool
                result = tool_registry.execute_tool(tool_name, args)
                results.append({"name": tool_name, "response": result})
            except Exception as e:
                results.append(
                    {
                        "name": tool_name,
                        "response": {"status": "error", "error": str(e)},
                    }
                )

        return results
