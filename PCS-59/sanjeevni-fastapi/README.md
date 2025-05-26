# InsightAI Chatbot

A powerful AI chatbot framework powered by Google's Gemini API with tool calling capabilities.

## Features

- Seamless integration with Google's Gemini API
- Support for custom tool calls and function execution
- Conversation history management
- Easy to extend with new tools and capabilities
- Simple web interface for interaction

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run the application:
   ```
   python app.py
   ```

## Project Structure

- `app.py`: Main Flask application for web interface
- `chatbot.py`: Core chatbot logic and Gemini API integration
- `database.py`: Conversation history and data storage
- `tools.py`: Custom tool implementations
- `config.py`: Configuration settings

## Extending with Custom Tools

To add a new tool, edit the `tools.py` file and add your tool definition following the provided examples.
