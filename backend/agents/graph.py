"""
LangGraph State Machine for FinPulse AI pipeline.
3-node sequential graph: DataIngestion → Scoring → OCENFormatter
"""
from langgraph.graph import StateGraph, END
from agents.data_ingestion import data_ingestion_agent
from agents.scoring import scoring_agent
from agents.ocen_formatter import ocen_formatter_agent
from models.schemas import LangGraphState


def should_continue(state: dict) -> str:
    """Route based on processing status."""
    if state.get("processing_status") == "error":
        return END
    return "continue"


def build_graph():
    """Build and compile the LangGraph state machine."""
    graph = StateGraph(dict)

    # Add nodes
    graph.add_node("data_ingestion", data_ingestion_agent)
    graph.add_node("scoring", scoring_agent)
    graph.add_node("ocen_formatter", ocen_formatter_agent)

    # Set entry point
    graph.set_entry_point("data_ingestion")

    # Add edges with error routing
    graph.add_conditional_edges(
        "data_ingestion",
        should_continue,
        {"continue": "scoring", END: END},
    )
    graph.add_conditional_edges(
        "scoring",
        should_continue,
        {"continue": "ocen_formatter", END: END},
    )
    graph.add_edge("ocen_formatter", END)

    return graph.compile()


# Module-level compiled graph
finpulse_graph = build_graph()


async def run_assessment(gstin: str, business_name: str, sector: str, application_id: str) -> dict:
    """Run the full LangGraph pipeline for an MSME assessment."""
    initial_state = {
        "gstin": gstin,
        "business_name": business_name,
        "sector": sector,
        "application_id": application_id,
        "processing_status": "started",
        "error_log": [],
    }

    result = finpulse_graph.invoke(initial_state)
    return result
