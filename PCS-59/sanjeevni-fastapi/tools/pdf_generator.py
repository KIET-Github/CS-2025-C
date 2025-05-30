from typing import Dict, List, Any, Optional
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime
import os
from tools.registry import tool_registry

def generate_pdf_table(data: Dict[str, Any], 
                      filename: str = None, 
                      title: str = "Report",
                      table_headers: List[str] = None) -> str:
    """
    Generate a PDF with a table based on the input dictionary data.
    
    Args:
        data: Dictionary containing the data to display in the table
        filename: Optional filename for the PDF (default: generated based on title and timestamp)
        title: Title for the PDF document
        table_headers: Optional list of column headers (if not provided, will use dict keys)
        
    Returns:
        The path to the generated PDF file
    """
    # Create a unique filename if none provided
    if filename is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_title = "".join(c if c.isalnum() else "_" for c in title)
        filename = f"{safe_title}_{timestamp}.pdf"
    
    # Ensure the filename has a .pdf extension
    if not filename.lower().endswith('.pdf'):
        filename += '.pdf'
    
    # Create output directory if it doesn't exist
    output_dir = os.path.join(os.getcwd(), "pdfs")
    os.makedirs(output_dir, exist_ok=True)
    
    # Full path to the output file
    output_path = os.path.join(output_dir, filename)
    
    # Create the PDF document
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    # Add title to the PDF
    elements.append(Paragraph(title, styles['Title']))
    elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 
                             styles['Normal']))
    
    # Process data for table
    if isinstance(data, dict):
        # Case 1: Simple dictionary (key-value pairs)
        if all(not isinstance(v, (dict, list)) for v in data.values()):
            if table_headers is None:
                table_headers = ["Key", "Value"]
            table_data = [[str(k), str(v)] for k, v in data.items()]
            table_data.insert(0, table_headers)
            
        # Case 2: List of dictionaries
        elif isinstance(data.get("data"), list) and all(isinstance(item, dict) for item in data.get("data", [])):
            items = data.get("data")
            if items and table_headers is None:
                # Use keys from the first dictionary as headers
                table_headers = list(items[0].keys())
            
            # Create table rows
            table_data = [table_headers]
            for item in items:
                row = [str(item.get(header, "")) for header in table_headers]
                table_data.append(row)
        
        # Case 3: Other structures
        else:
            # Flatten complex data
            if table_headers is None:
                table_headers = ["Key", "Value"]
            table_data = []
            
            def flatten_dict(d, prefix=""):
                for k, v in d.items():
                    key = f"{prefix}.{k}" if prefix else k
                    if isinstance(v, dict):
                        flatten_dict(v, key)
                    elif isinstance(v, list):
                        table_data.append([str(key), f"List with {len(v)} items"])
                    else:
                        table_data.append([str(key), str(v)])
            
            flatten_dict(data)
            table_data.insert(0, table_headers)
    
    # Create the table
    table = Table(table_data)
    
    # Style the table
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ])
    table.setStyle(style)
    
    # Add the table to the PDF
    elements.append(table)
    
    # Build the PDF
    doc.build(elements)
    
    return output_path

# Define the parameters schema for the PDF table generator
pdf_table_params = {
    "type": "object",
    "properties": {
        "data": {
            "type": "object",
            "description": "Dictionary containing the data to display in the table"
        },
        "filename": {
            "type": "string",
            "description": "Optional filename for the PDF (default: generated based on title and timestamp)"
        },
        "title": {
            "type": "string",
            "description": "Title for the PDF document"
        },
        "table_headers": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "Optional list of column headers (if not provided, will use dict keys)"
        }
    },
    "required": ["data"]
}

# Register the PDF table generator tool with the registry
tool_registry.register_tool(
    name="generate_pdf_table",
    description="Generate a PDF with a table based on the input dictionary data",
    parameters=pdf_table_params,
    handler=generate_pdf_table
)