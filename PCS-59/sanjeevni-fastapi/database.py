import json
import os
import sqlite3
from datetime import datetime
from typing import Dict, List, Any, Optional
import uuid
from config import logger

class SQLiteDatabase:
    """
    A simple database class for storing conversation history and other data.
    """
    def __init__(self, db_path: str = "conversations.db"):
        """
        Initialize the database.
        
        Args:
            db_path: Path to the SQLite database file
        """
        self.db_path = db_path
        self._initialize_db()
    
    def _initialize_db(self):
        """Initialize the database schema if it doesn't exist."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create conversations table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create messages table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT,
            role TEXT,
            content TEXT,
            timestamp TIMESTAMP,
            tool_calls TEXT,
            tool_results TEXT,
            FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
        )
        ''')
        
        conn.commit()
        conn.close()
    
    def create_conversation(self, conversation_id: Optional[str] = None) -> str:
        """
        Create a new conversation.
        
        Args:
            conversation_id: Optional ID for the conversation. If not provided, a UUID will be generated.
            
        Returns:
            The conversation ID
        """
        if conversation_id is None:
            conversation_id = str(uuid.uuid4())
        
        created_at = datetime.now().isoformat()
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            """
            INSERT INTO conversations (id, created_at)
            VALUES (?, ?)
            """,
            (conversation_id, created_at)
        )
        
        conn.commit()
        conn.close()
        
        logger.info(f"Created new conversation: {conversation_id}")
        return conversation_id
    
    def conversation_exists(self, conversation_id: str) -> bool:
        """
        Check if a conversation exists in the database.
        
        Args:
            conversation_id: ID of the conversation to check
            
        Returns:
            True if the conversation exists, False otherwise
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Check if conversation exists
        cursor.execute(
            "SELECT id FROM conversations WHERE id = ?",
            (conversation_id,)
        )
        
        result = cursor.fetchone() is not None
        conn.close()
        
        return result
    
    def add_message(self, conversation_id: str, role: str, content: str, 
                   tool_calls: Optional[List[Dict[str, Any]]] = None,
                   tool_results: Optional[List[Dict[str, Any]]] = None) -> None:
        """
        Add a message to a conversation.
        
        Args:
            conversation_id: ID of the conversation
            role: Role of the message sender (user or assistant)
            content: Message content
            tool_calls: Optional list of tool calls
            tool_results: Optional list of tool results
        """
        message_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        # Serialize tool calls and results to JSON if they exist
        tool_calls_json = json.dumps(tool_calls) if tool_calls else None
        tool_results_json = json.dumps(tool_results) if tool_results else None
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if not self.conversation_exists(conversation_id):
            # Create the conversation if it doesn't exist
            self.create_conversation(conversation_id)
        
        cursor.execute(
            """
            INSERT INTO messages (id, conversation_id, role, content, timestamp, tool_calls, tool_results)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (message_id, conversation_id, role, content, timestamp, tool_calls_json, tool_results_json)
        )
        
        conn.commit()
        conn.close()
        
        logger.info(f"Added {role} message to conversation {conversation_id}")
    
    def get_conversation(self, conversation_id: str) -> List[Dict[str, Any]]:
        """
        Get a conversation by ID.
        
        Args:
            conversation_id: ID of the conversation
            
        Returns:
            List of messages in the conversation
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        if not self.conversation_exists(conversation_id):
            logger.warning(f"Conversation not found: {conversation_id}")
            conn.close()
            return []
        
        # Get all messages for the conversation
        cursor.execute(
            """
            SELECT role, content, timestamp, tool_calls, tool_results
            FROM messages
            WHERE conversation_id = ?
            ORDER BY timestamp
            """,
            (conversation_id,)
        )
        
        messages = []
        for row in cursor.fetchall():
            message = {
                "role": row["role"],
                "content": row["content"],
                "timestamp": row["timestamp"]
            }
            
            # Parse tool calls and results if they exist
            if row["tool_calls"]:
                message["tool_calls"] = json.loads(row["tool_calls"])
            
            if row["tool_results"]:
                message["tool_results"] = json.loads(row["tool_results"])
            
            messages.append(message)
        
        conn.close()
        
        message_count = len(messages)
        logger.info(f"Retrieved conversation {conversation_id} with {message_count} messages")
        
        return messages
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """
        Delete a conversation and all its messages.
        
        Args:
            conversation_id: ID of the conversation to delete
            
        Returns:
            True if the conversation was deleted, False if it wasn't found
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if not self.conversation_exists(conversation_id):
            logger.warning(f"Attempted to delete non-existent conversation: {conversation_id}")
            conn.close()
            return False
        
        # Delete all messages in the conversation
        cursor.execute(
            """
            DELETE FROM messages WHERE conversation_id = ?
            """,
            (conversation_id,)
        )
        
        # Delete the conversation
        cursor.execute(
            """
            DELETE FROM conversations WHERE id = ?
            """,
            (conversation_id,)
        )
        
        conn.commit()
        conn.close()
        
        logger.info(f"Deleted conversation: {conversation_id}")
        return True
    
    def get_all_conversations(self) -> List[Dict[str, Any]]:
        """
        Get a list of all conversations.
        
        Returns:
            List of conversations with their IDs and creation timestamps
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute(
            """
            SELECT c.id, c.created_at, COUNT(m.id) as message_count,
                   MAX(m.timestamp) as last_activity
            FROM conversations c
            LEFT JOIN messages m ON c.id = m.conversation_id
            GROUP BY c.id
            ORDER BY last_activity DESC
            """
        )
        
        conversations = []
        for row in cursor.fetchall():
            conversation = {
                "id": row["id"],
                "created_at": row["created_at"],
                "message_count": row["message_count"],
                "last_activity": row["last_activity"]
            }
            conversations.append(conversation)
        
        conn.close()
        
        logger.info(f"Retrieved {len(conversations)} conversations")
        
        return conversations
    
    def get_conversations(self) -> List[Dict[str, Any]]:
        """
        Get a list of all conversations.
        
        Returns:
            List of conversations with their IDs and creation timestamps
        """
        return self.get_all_conversations()

# For backward compatibility
DriveThruDatabase = SQLiteDatabase
