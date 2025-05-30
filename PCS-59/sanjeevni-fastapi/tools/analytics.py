from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import random
from tools.registry import tool_registry

def generate_visualization(chart_type: str, data_source: str, time_period: str = "last_30_days", 
                          metrics: List[str] = None) -> Dict[str, Any]:
    """
    Generate a data visualization based on the specified parameters.
    This is a mock implementation - in a real app, you would use a data visualization library.
    
    Args:
        chart_type: Type of chart to generate (bar, line, pie, etc.)
        data_source: Source of data (customer, product, pos, drivethru)
        time_period: Time period for the data
        metrics: List of metrics to include in the visualization
        
    Returns:
        Visualization details and mock data
    """
    if metrics is None:
        metrics = ["sales", "transactions"]
    # Generate mock data points
    data_points = []
    
    # Determine number of data points based on time period
    if time_period == "last_7_days":
        num_points = 7
        date_format = "%Y-%m-%d"
        date_increment = timedelta(days=1)
        start_date = datetime.now() - timedelta(days=7)
    elif time_period == "last_30_days":
        num_points = 30
        date_format = "%Y-%m-%d"
        date_increment = timedelta(days=1)
        start_date = datetime.now() - timedelta(days=30)
    elif time_period == "last_12_months":
        num_points = 12
        date_format = "%Y-%m"
        date_increment = timedelta(days=30)
        start_date = datetime.now() - timedelta(days=365)
    else:
        num_points = 10
        date_format = "%Y-%m-%d"
        date_increment = timedelta(days=1)
        start_date = datetime.now() - timedelta(days=10)
    
    # Generate data points
    current_date = start_date
    for i in range(num_points):
        point = {
            "date": current_date.strftime(date_format),
        }
        
        # Add values for each metric
        for metric in metrics:
            if metric == "sales":
                point[metric] = round(random.uniform(1000, 5000), 2)
            elif metric == "transactions":
                point[metric] = random.randint(50, 200)
            elif metric == "average_order_value":
                point[metric] = round(random.uniform(15, 30), 2)
            elif metric == "customer_satisfaction":
                point[metric] = round(random.uniform(3.5, 5.0), 1)
            else:
                point[metric] = random.randint(10, 100)
        
        data_points.append(point)
        current_date += date_increment
    
    # Create visualization response
    visualization = {
        "chart_type": chart_type,
        "data_source": data_source,
        "time_period": time_period,
        "metrics": metrics,
        "data": data_points,
        "generated_at": datetime.now().isoformat(),
        "visualization_url": f"https://example.com/visualizations/{chart_type}_{data_source}_{time_period}"
    }
    
    return visualization

def analyze_metrics(data_source: str, metrics: List[str], time_period: str = "last_30_days", 
                   comparison_period: str = None) -> Dict[str, Any]:
    """
    Analyze metrics from a data source and provide insights.
    This is a mock implementation - in a real app, you would use actual data analysis.
    
    Args:
        data_source: Source of data (customer, product, pos, drivethru)
        metrics: List of metrics to analyze
        time_period: Time period for the data
        comparison_period: Optional period to compare against
        
    Returns:
        Analysis results and insights
    """
    if metrics is None:
        metrics = ["sales", "transactions"]
    
    # Generate mock analysis results
    analysis_results = {
        "data_source": data_source,
        "time_period": time_period,
        "comparison_period": comparison_period,
        "metrics": {},
        "insights": [],
        "generated_at": datetime.now().isoformat()
    }
    
    # Generate mock data for each metric
    for metric in metrics:
        current_value = None
        previous_value = None
        
        if metric == "sales":
            current_value = round(random.uniform(50000, 150000), 2)
            change_pct = random.uniform(-15, 25)
            previous_value = round(current_value / (1 + (change_pct / 100)), 2)
        elif metric == "transactions":
            current_value = random.randint(2000, 5000)
            change_pct = random.uniform(-10, 20)
            previous_value = round(current_value / (1 + (change_pct / 100)))
        elif metric == "average_order_value":
            current_value = round(random.uniform(15, 30), 2)
            change_pct = random.uniform(-5, 15)
            previous_value = round(current_value / (1 + (change_pct / 100)), 2)
        elif metric == "customer_satisfaction":
            current_value = round(random.uniform(3.5, 4.9), 1)
            change_pct = random.uniform(-5, 10)
            previous_value = round(current_value / (1 + (change_pct / 100)), 1)
        else:
            current_value = random.randint(100, 1000)
            change_pct = random.uniform(-20, 30)
            previous_value = round(current_value / (1 + (change_pct / 100)))
        
        analysis_results["metrics"][metric] = {
            "current_value": current_value,
            "previous_value": previous_value,
            "change_percentage": round(change_pct, 2),
            "trend": "up" if change_pct > 0 else "down"
        }
        
        # Generate mock insights
        if change_pct > 15:
            analysis_results["insights"].append(f"Significant increase in {metric} by {round(change_pct, 2)}%")
        elif change_pct < -15:
            analysis_results["insights"].append(f"Concerning decrease in {metric} by {round(abs(change_pct), 2)}%")
        elif change_pct > 5:
            analysis_results["insights"].append(f"Moderate growth in {metric} by {round(change_pct, 2)}%")
        elif change_pct < -5:
            analysis_results["insights"].append(f"Slight decline in {metric} by {round(abs(change_pct), 2)}%")
        else:
            analysis_results["insights"].append(f"{metric.capitalize()} remained relatively stable")
    
    # Add some general insights
    if data_source == "drivethru":
        analysis_results["insights"].append("Drive-thru service times have improved during peak hours")
    elif data_source == "pos":
        analysis_results["insights"].append("POS transactions show increased use of digital payment methods")
    elif data_source == "customer":
        analysis_results["insights"].append("Customer retention has improved for loyalty program members")
    
    return analysis_results

def generate_kpi_dashboard(kpis: List[str] = None, time_period: str = "last_30_days") -> Dict[str, Any]:
    """
    Generate a KPI dashboard with key performance indicators.
    This is a mock implementation - in a real app, you would use actual KPI data.
    
    Args:
        kpis: List of KPIs to include in the dashboard
        time_period: Time period for the KPI data
        
    Returns:
        Dashboard with KPI data
    """
    if kpis is None:
        kpis = ["sales", "transactions", "average_order_value", "customer_satisfaction"]
    
    # Generate mock KPI dashboard
    dashboard = {
        "title": f"KPI Dashboard - {time_period}",
        "time_period": time_period,
        "generated_at": datetime.now().isoformat(),
        "kpis": {},
        "summary": "Overall performance is trending positive with improvements in key metrics."
    }
    
    # Generate data for each KPI
    for kpi in kpis:
        if kpi == "sales":
            current_value = round(random.uniform(100000, 300000), 2)
            target_value = round(current_value * random.uniform(0.9, 1.2), 2)
            previous_value = round(current_value * random.uniform(0.8, 1.1), 2)
            unit = "$"
        elif kpi == "transactions":
            current_value = random.randint(5000, 10000)
            target_value = round(current_value * random.uniform(0.9, 1.2))
            previous_value = round(current_value * random.uniform(0.8, 1.1))
            unit = "count"
        elif kpi == "average_order_value":
            current_value = round(random.uniform(15, 35), 2)
            target_value = round(current_value * random.uniform(0.9, 1.2), 2)
            previous_value = round(current_value * random.uniform(0.8, 1.1), 2)
            unit = "$"
        elif kpi == "customer_satisfaction":
            current_value = round(random.uniform(3.5, 4.9), 1)
            target_value = round(min(5.0, current_value * random.uniform(0.9, 1.1)), 1)
            previous_value = round(current_value * random.uniform(0.8, 1.1), 1)
            unit = "rating"
        else:
            current_value = random.randint(100, 1000)
            target_value = round(current_value * random.uniform(0.9, 1.2))
            previous_value = round(current_value * random.uniform(0.8, 1.1))
            unit = "count"
        
        # Calculate performance against target
        performance_pct = (current_value / target_value) * 100
        
        # Calculate change from previous period
        change_pct = ((current_value - previous_value) / previous_value) * 100
        
        dashboard["kpis"][kpi] = {
            "name": kpi.replace("_", " ").title(),
            "current_value": current_value,
            "target_value": target_value,
            "previous_value": previous_value,
            "unit": unit,
            "performance_percentage": round(performance_pct, 2),
            "change_percentage": round(change_pct, 2),
            "status": "on_target" if performance_pct >= 95 else "below_target" if performance_pct < 80 else "near_target"
        }
    
    return dashboard

# Define the parameters schema for the visualization tool
visualization_params = {
    "type": "object",
    "properties": {
        "chart_type": {
            "type": "string",
            "enum": ["bar", "line", "pie", "scatter", "area", "radar"],
            "description": "Type of chart to generate"
        },
        "data_source": {
            "type": "string",
            "enum": ["customer", "product", "pos", "drivethru"],
            "description": "Source of data for the visualization"
        },
        "time_period": {
            "type": "string",
            "enum": ["last_7_days", "last_30_days", "last_12_months", "year_to_date"],
            "description": "Time period for the data"
        },
        "metrics": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "List of metrics to include in the visualization"
        }
    },
    "required": ["chart_type", "data_source"]
}

# Define the parameters schema for the metrics analysis tool
metrics_analysis_params = {
    "type": "object",
    "properties": {
        "data_source": {
            "type": "string",
            "enum": ["customer", "product", "pos", "drivethru"],
            "description": "Source of data for analysis"
        },
        "metrics": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "List of metrics to analyze"
        },
        "time_period": {
            "type": "string",
            "enum": ["last_7_days", "last_30_days", "last_12_months", "year_to_date"],
            "description": "Time period for the data"
        },
        "comparison_period": {
            "type": "string",
            "enum": ["previous_period", "same_period_last_year", "none"],
            "description": "Period to compare against"
        }
    },
    "required": ["data_source", "metrics"]
}

# Define the parameters schema for the KPI dashboard tool
kpi_dashboard_params = {
    "type": "object",
    "properties": {
        "kpis": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "description": "List of KPIs to include in the dashboard"
        },
        "time_period": {
            "type": "string",
            "enum": ["last_7_days", "last_30_days", "last_12_months", "year_to_date"],
            "description": "Time period for the KPI data"
        }
    }
}

# Register the analytics tools with the registry
tool_registry.register_tool(
    name="generate_visualization",
    description="Generate a data visualization based on the specified parameters",
    parameters=visualization_params,
    handler=generate_visualization
)

tool_registry.register_tool(
    name="analyze_metrics",
    description="Analyze metrics from a data source and provide insights",
    parameters=metrics_analysis_params,
    handler=analyze_metrics
)

tool_registry.register_tool(
    name="generate_kpi_dashboard",
    description="Generate a KPI dashboard with key performance indicators",
    parameters=kpi_dashboard_params,
    handler=generate_kpi_dashboard
)
