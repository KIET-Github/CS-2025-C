import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger("insightai")

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")

# FastAPI app configuration
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# API metadata
API_VERSION = "1.0.0"
API_TITLE = "InsightAI API"
API_DESCRIPTION = "A FastAPI-based AI chatbot framework using Google Gemini API"
API_PREFIX = "/api/v1"

# Chatbot Identity Configuration
CHATBOT_IDENTITY = {
    "name": "Sanjeevni AI",
    "version": "BETA",
    "description": "An advanced assistant for medical checkup",
    "created_date": "2025-04-30",
    "purpose": "To ask the problems of patients and user and make a report of the problems.",
}

# Chatbot Capabilities Configuration
CHATBOT_CAPABILITIES = {
    "analytics": [
        "asking about the symptoms of the patients , with severity and duration",
        "Do not give any medical advice or diagnosis",
        "Provide information about the symptoms and their possible causes",
        "Generate a report of the problems",
        "Further report and medications will be provided after the report is generated",
        "Do end the conversation with user when it says he have no problem remaining",
        "DO ask if report is upto the mark or not",
    ],
    
    
}

# System prompt template for the chatbot
SYSTEM_PROMPT_TEMPLATE = """
You are {name}, version {version}, an advanced Medical assistant .

Your primary purpose is: {purpose}

When responding to users, remember that you specialize in:
{capabilities}



Always respond in a professional, data-driven manner. When providing analytics, cite the source of your data and explain your methodology. If asked to create visualizations, describe what type would be most appropriate and why.
"""

# Format the system prompt with the chatbot identity and capabilities
def get_system_prompt():
    """Get the formatted system prompt for the chatbot."""
    capabilities_str = "\n".join([f"- {cap}" for cap in CHATBOT_CAPABILITIES["analytics"]])
    
    return SYSTEM_PROMPT_TEMPLATE.format(
        name=CHATBOT_IDENTITY["name"],
        version=CHATBOT_IDENTITY["version"],
        purpose=CHATBOT_IDENTITY["purpose"],
        capabilities=capabilities_str,
    )

# Conversation settings
MAX_CONVERSATION_HISTORY = 10
