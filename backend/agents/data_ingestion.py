"""
Agent 1 — DataIngestionAgent
Fetches data from all 4 mock sources and normalizes into a unified payload.
"""
from mock_data.gst_mock import get_gst_data
from mock_data.upi_mock import get_upi_data
from mock_data.epfo_mock import get_epfo_data
from mock_data.aa_mock import get_aa_data


def data_ingestion_agent(state: dict) -> dict:
    """
    LangGraph node: fetches and normalizes data from all 4 sources.
    Input state keys: gstin, business_name, sector, application_id
    Output adds: raw_gst_data, raw_upi_data, raw_epfo_data, raw_aa_data, normalized_payload
    """
    gstin = state.get("gstin", "27AABCU9603R1ZX")

    try:
        raw_gst = get_gst_data(gstin)
        raw_upi = get_upi_data(gstin)
        raw_epfo = get_epfo_data(gstin)
        raw_aa = get_aa_data(gstin)

        # Normalize into unified payload
        normalized = {
            "gstin": gstin,
            "business_name": raw_gst["business_name"],
            "sector": raw_gst["sector"],
            "city": raw_gst["city"],
            # GST metrics
            "gst_filing_rate": raw_gst["summary"]["filing_rate"],
            "gst_on_time_rate": raw_gst["summary"]["on_time_rate"],
            "gst_avg_monthly_turnover": raw_gst["summary"]["avg_monthly_turnover"],
            "gst_yoy_growth": raw_gst["summary"]["yoy_growth"],
            "gst_filed_count": raw_gst["summary"]["filed_count"],
            # UPI metrics
            "upi_positive_months": raw_upi["summary"]["positive_months"],
            "upi_avg_monthly_inflow": raw_upi["summary"]["avg_monthly_inflow"],
            "upi_cashflow_health": raw_upi["summary"]["cashflow_health"],
            "upi_growth_rate": raw_upi["summary"]["upi_growth_rate"],
            "upi_net_flow_12m": raw_upi["summary"]["net_flow_12m"],
            # EPFO metrics
            "epfo_avg_employees": raw_epfo["summary"]["avg_employee_count"],
            "epfo_current_employees": raw_epfo["summary"]["current_employee_count"],
            "epfo_employee_growth": raw_epfo["summary"]["employee_growth_rate"],
            "epfo_tenure_years": raw_epfo["summary"]["tenure_years"],
            "epfo_pf_compliance": raw_epfo["summary"]["pf_compliance_rate"],
            # AA metrics
            "aa_dscr": raw_aa["summary"]["dscr"],
            "aa_positive_months": raw_aa["summary"]["positive_months"],
            "aa_avg_monthly_balance": raw_aa["summary"]["avg_monthly_balance"],
            "aa_cashflow_health": raw_aa["summary"]["cashflow_health"],
            "aa_monthly_emi": raw_aa["summary"]["existing_monthly_emi"],
            # Invoice growth
            "invoice_yoy_growth": raw_gst["summary"]["yoy_growth"],
        }

        return {
            **state,
            "raw_gst_data": raw_gst["summary"],
            "raw_upi_data": raw_upi["summary"],
            "raw_epfo_data": raw_epfo["summary"],
            "raw_aa_data": raw_aa["summary"],
            "normalized_payload": normalized,
            "processing_status": "data_ingested",
            "error_log": state.get("error_log", []),
        }

    except Exception as e:
        return {
            **state,
            "processing_status": "error",
            "error_log": state.get("error_log", []) + [f"DataIngestion error: {str(e)}"],
        }
