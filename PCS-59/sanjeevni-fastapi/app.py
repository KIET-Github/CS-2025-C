from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from datetime import datetime

from config import HOST, PORT, DEBUG, API_PREFIX, API_TITLE, API_DESCRIPTION, API_VERSION
from chatbots import create_chatbot

# Initialize FastAPI app
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create a chatbot instance
# By default, this will create a GeminiChatbot
chatbot = create_chatbot(provider="gemini")

# Pydantic models for request/response validation
class MessageRequest(BaseModel):
    message: str

class ChatRequest(BaseModel):
    message:str
    audio: Optional[bytes] = None
    lipsync:Dict[str, Any] = None
    facialExpression:str = None
    animation: str = None

class ConversationResponse(BaseModel):
    conversation_id: str
    created_at: str

class TokenUsage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0

class MessageResponse(BaseModel):
    messages: List[Dict[str, Any]]
    token_usage: Optional[TokenUsage] = None

class HistoryResponse(BaseModel):
    conversation_id: str
    messages: List[Dict[str, Any]]
    created_at: Optional[str] = None
    last_activity: Optional[str] = None

class StatusResponse(BaseModel):
    success: bool

class ConversationsResponse(BaseModel):
    conversations: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    version: str
    title: str
    description: str

# Store active conversations
active_conversations = {}

# Helper function to check if a conversation exists and add it to active_conversations if needed
def ensure_conversation_active(conversation_id: str) -> bool:
    """
    Check if a conversation exists in the database and add it to active_conversations if needed.
    
    Args:
        conversation_id: The ID of the conversation to check
        
    Returns:
        True if the conversation exists, False otherwise
    """
    # First check if it's already in our active_conversations dictionary
    if conversation_id in active_conversations:
        return True
    
    # If not, check if it exists in the database
    try:
        # Use the database's conversation check method directly instead of relying on history
        # This will work even if the conversation exists but has no messages
        if chatbot.database.conversation_exists(conversation_id):
            # Conversation exists in the database, add it to active_conversations
            active_conversations[conversation_id] = {
                "created_at": datetime.now().isoformat(),  # We don't know the real creation time, so use now
                "last_activity": datetime.now().isoformat()
            }
            return True
    except Exception:
        # If there's an error checking the database, assume the conversation doesn't exist
        pass
    
    # Conversation doesn't exist
    return False

# API routes
@app.post(f"{API_PREFIX}/conversations", response_model=ConversationResponse, tags=["Conversations"])
async def create_conversation():
    """
    Create a new conversation and return its ID.
    
    Returns:
        A dictionary containing the new conversation ID
    """
    conversation_id = chatbot.create_conversation()
    
    # Store creation time
    active_conversations[conversation_id] = {
        "created_at": datetime.now().isoformat(),
        "last_activity": datetime.now().isoformat()
    }
    
    return {
        "conversation_id": conversation_id,
        "created_at": active_conversations[conversation_id]["created_at"]
    }

@app.post(f"{API_PREFIX}/conversations/{{conversation_id}}/messages", response_model=MessageResponse, tags=["Messages"])
async def send_message(conversation_id: str, message_request: MessageRequest):
    """
    Send a message to the chatbot in a specific conversation.
    
    Args:
        conversation_id: The ID of the conversation
        message_request: The message to send
        
    Returns:
        The chatbot's response
        
    Raises:
        404: If the conversation is not found
        500: If there's an error processing the message
    """
    # Check if conversation exists
    if not ensure_conversation_active(conversation_id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    try:
        # Send message to chatbot - add await here
        response = await chatbot.send_message(conversation_id, message_request.message)
        
        # Update last activity time
        active_conversations[conversation_id]["last_activity"] = datetime.now().isoformat()
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get(f"{API_PREFIX}/conversations/{{conversation_id}}", response_model=HistoryResponse, tags=["Conversations"])
async def get_conversation(conversation_id: str):
    """
    Get the message history for a specific conversation.
    
    Args:
        conversation_id: The ID of the conversation to retrieve
        
    Returns:
        A list of messages in the conversation
        
    Raises:
        404: If the conversation is not found
    """
    # Check if conversation exists
    if not ensure_conversation_active(conversation_id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    try:
        # Get conversation history
        history = chatbot.get_conversation_history(conversation_id)
        
        return {
            "conversation_id": conversation_id,
            "messages": history,
            "created_at": active_conversations[conversation_id]["created_at"],
            "last_activity": active_conversations[conversation_id]["last_activity"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get(f"{API_PREFIX}/conversations", response_model=ConversationsResponse, tags=["Conversations"])
async def get_all_conversations():
    """
    Get a list of all conversations.
    
    Returns:
        A list of all conversations with their IDs and metadata
    """
    try:
        # Get all conversations
        conversations = chatbot.get_all_conversations()
        print(conversations)
        # Add metadata from active_conversations
        for conversation in conversations:
            conversation_id = conversation["id"]
            if conversation_id in active_conversations:
                conversation["created_at"] = active_conversations[conversation_id]["created_at"]
                conversation["last_activity"] = active_conversations[conversation_id]["last_activity"]
            else:
                # Add conversation to active_conversations if it's not there
                active_conversations[conversation_id] = {
                    "created_at": datetime.now().isoformat(),
                    "last_activity": datetime.now().isoformat()
                }
                conversation["created_at"] = active_conversations[conversation_id]["created_at"]
                conversation["last_activity"] = active_conversations[conversation_id]["last_activity"]
        
        return {"conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete(f"{API_PREFIX}/conversations/{{conversation_id}}", response_model=StatusResponse, tags=["Conversations"])
async def delete_conversation(conversation_id: str):
    """
    Delete a specific conversation.
    
    Args:
        conversation_id: The ID of the conversation to delete
        
    Returns:
        A status message
        
    Raises:
        404: If the conversation is not found
    """
    # Check if conversation exists
    if not ensure_conversation_active(conversation_id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    try:
        # Delete conversation
        result = chatbot.delete_conversation(conversation_id)
        
        if result:
            # Remove from active conversations
            if conversation_id in active_conversations:
                del active_conversations[conversation_id]
            return {"success": True}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete conversation")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get(f"{API_PREFIX}/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """
    API health check endpoint.
    
    Returns:
        Health status information
    """
    return {
        "status": "ok",
        "version": API_VERSION,
        "title": API_TITLE,
        "description": API_DESCRIPTION
    }

# Run the application
if __name__ == "__main__":
    import uvicorn
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Run the FastAPI app with Uvicorn
    uvicorn.run("app:app", host=HOST, port=PORT, reload=DEBUG)
