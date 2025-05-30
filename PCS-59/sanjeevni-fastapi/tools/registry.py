from typing import Dict, List, Any, Callable

# Mapping from JSON Schema types to Genai Types
TYPE_MAP = {
    "string": "STRING",
    "number": "NUMBER",
    "integer": "INTEGER",
    "boolean": "BOOLEAN",
    "array": "ARRAY",
    "object": "OBJECT",
}

class ToolRegistry:
    """Registry for all available tools that can be called by the chatbot."""
    
    def __init__(self):
        self.tools: Dict[str, Dict[str, Any]] = {}
    
    def register_tool(self, name: str, description: str, parameters: Dict[str, Any], 
                      handler: Callable):
        """
        Register a new tool with the registry.
        
        Args:
            name: Unique name for the tool
            description: Description of what the tool does
            parameters: JSON Schema object describing the parameters
            handler: Function that implements the tool's functionality
        """
        self.tools[name] = {
            "name": name,
            "description": description,
            "parameters": parameters, # Store original parameters schema
            "handler": handler
        }
    
    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        """
        Get tool definitions formatted for the Gemini API using google.genai types.
        
        Returns:
            List of function declarations in the format expected by google.genai
        """
        function_declarations = []
        for tool_config in self.tools.values():
            function_declarations.append({
                "name": tool_config["name"],
                "description": tool_config["description"],
                "parameters": tool_config["parameters"]
            })
        
        return function_declarations
    
    def execute_tool(self, tool_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a tool with the given parameters.
        
        Args:
            tool_name: Name of the tool to execute
            params: Parameters to pass to the tool
            
        Returns:
            Result of the tool execution
            
        Raises:
            ValueError: If tool doesn't exist or required parameters are missing
        """
        if tool_name not in self.tools:
            raise ValueError(f"Tool '{tool_name}' not found")
        
        tool = self.tools[tool_name]
        
        # Check for required parameters
        for param in tool["parameters"].get("required", []):
            if param not in params:
                raise ValueError(f"Required parameter '{param}' missing for tool '{tool_name}'")
        
        # Execute the tool handler
        try:
            result = tool["handler"](**params)
            return {
                "status": "success",
                "result": result
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

# Create a global tool registry
tool_registry = ToolRegistry()
