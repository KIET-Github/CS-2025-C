from typing import Dict, List, Any, Optional
import uuid
from abc import ABC, abstractmethod

from database import DriveThruDatabase
from config import MAX_CONVERSATION_HISTORY, logger, get_system_prompt
from tools import tool_registry

class BaseChatbot(ABC):
    """
    Abstract base class for all chatbot implementations.
    This provides common functionality that all chatbot implementations should have.
    """
    
    def __init__(self, database_path: str = "conversations.db"):
        """
        Initialize the base chatbot.
        
        Args:
            database_path: Path to the conversation database file
        """
        self.database = DriveThruDatabase(database_path)
        self.tools = None
    
    def create_conversation(self) -> str:
        """
        Create a new conversation and return its ID.
        
        Returns:
            Conversation ID
        """
        conversation_id = str(uuid.uuid4())
        self.database.create_conversation(conversation_id)
        return conversation_id
    
    def get_conversation_history(self, conversation_id: str) -> List[Dict[str, Any]]:
        """
        Get the conversation history.
        
        Args:
            conversation_id: ID of the conversation
            
        Returns:
            List of messages in the conversation
        """
        return self.database.get_conversation(conversation_id)
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """
        Delete a conversation.
        
        Args:
            conversation_id: ID of the conversation
            
        Returns:
            True if the conversation was deleted, False otherwise
        """
        return self.database.delete_conversation(conversation_id)
    
    def get_all_conversations(self) -> List[Dict[str, Any]]:
        """
        Get all conversations.
        
        Returns:
            List of all conversations
        """
        return self.database.get_all_conversations()
    
    @abstractmethod
    def _prepare_tools(self):
        """
        Prepare tools in the format expected by the specific LLM.
        This method must be implemented by each chatbot subclass.
        """
        pass
    
    @abstractmethod
    def send_message(self, conversation_id: str, message: str, max_tool_call_depth: int = 10) -> Dict[str, Any]:
        """
        Send a message to the chatbot and get a response.
        This method must be implemented by each chatbot subclass.
        
        Args:
            conversation_id: The ID of the conversation
            message: The message to send
            max_tool_call_depth: Maximum depth of recursive tool calls
            
        Returns:
            A dictionary containing the response and conversation ID
        """
        pass
