from chatbots.base import BaseChatbot
from chatbots.gemini import GeminiChatbot
from chatbots.openai import OpenAIChatbot

# Export the chatbot classes
__all__ = ['BaseChatbot', 'GeminiChatbot', 'OpenAIChatbot']

# Factory function to create the appropriate chatbot based on the provider
def create_chatbot(provider: str = "gemini", **kwargs):
    """
    Factory function to create a chatbot instance based on the provider.
    
    Args:
        provider: The LLM provider to use ('gemini' or 'openai')
        **kwargs: Additional arguments to pass to the chatbot constructor
        
    Returns:
        An instance of the appropriate chatbot class
        
    Raises:
        ValueError: If the provider is not supported
    """
    if provider.lower() == "gemini":
        return GeminiChatbot(**kwargs)
    elif provider.lower() == "openai":
        return OpenAIChatbot(**kwargs)
    else:
        raise ValueError(f"Unsupported provider: {provider}. Supported providers are 'gemini' and 'openai'.")
