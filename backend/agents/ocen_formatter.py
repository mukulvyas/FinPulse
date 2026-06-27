"""
Agent 3 — OCENFormatterAgent
Generates recommendation, formats HealthCard, OCEN 4.0 payload, and Officer Dossier.
"""
from datetime import datetime
import math


def _compute_loan_offers(total_score: int, sector: str, avg_monthly_inflow: int) -> list:
    """Generate 3 pre-approved loan products based on score."""

    def calc_emi(principal: int, annual_rate: float, months: int) -> int:
        r = annual_rate / 12 / 100
        if r == 0:
            return principal // months
        emi = principal * r * (1 + r) ** months / ((1 + r) ** months - 1)
        return int(emi)

    # Base eligible amount: 4x monthly inflow, scaled by score
    score_factor = total_score / 900
    base_amount = int(avg_monthly_inflow * 4 * score_factor)

    if total_score >= 750:
        offers = [
            {
                "product_name": "IDBI MSME Growth Loan",
                "max_amount": min(5000000, base_amount),
                "interest_rate": 9.5,
                "tenure_months": 60,
                "emi": calc_emi(min(5000000, base_amount), 9.5, 60),
                "processing_fee": 1.0,
                "description": "Our flagship MSME product for high-performing businesses. Low rate, long tenure.",
            },
            {
                "product_name": "IDBI Working Capital Plus",
                "max_amount": min(2500000, base_amount // 2),
                "interest_rate": 10.5,
                "tenure_months": 36,
                "emi": calc_emi(min(2500000, base_amount // 2), 10.5, 36),
                "processing_fee": 0.75,
                "description": "Flexible working capital for inventory and operational needs.",
            },
            {
                "product_name": "IDBI GST-Linked Credit",
                "max_amount": min(1500000, base_amount // 3),
                "interest_rate": 11.0,
                "tenure_months": 24,
                "emi": calc_emi(min(1500000, base_amount // 3), 11.0, 24),
                "processing_fee": 0.5,
                "description": "Short-term credit linked to your GST turnover for seasonal needs.",
            },
        ]
    elif total_score >= 620:
        offers = [
            {
                "product_name": "IDBI MSME Standard Loan",
                "max_amount": min(2000000, base_amount),
                "interest_rate": 12.5,
                "tenure_months": 48,
                "emi": calc_emi(min(2000000, base_amount), 12.5, 48),
                "processing_fee": 1.5,
                "description": "Standard MSME loan for businesses in the review band. Subject to officer approval.",
            },
            {
                "product_name": "IDBI Trade Finance",
                "max_amount": min(1000000, base_amount // 2),
                "interest_rate": 13.5,
                "tenure_months": 24,
                "emi": calc_emi(min(1000000, base_amount // 2), 13.5, 24),
                "processing_fee": 1.25,
                "description": "Short-term trade finance for B2B invoice settlements.",
            },
            {
                "product_name": "IDBI Micro Business Loan",
                "max_amount": min(500000, base_amount // 4),
                "interest_rate": 14.5,
                "tenure_months": 18,
                "emi": calc_emi(min(500000, base_amount // 4), 14.5, 18),
                "processing_fee": 1.0,
                "description": "Smaller ticket loan for businesses improving their financial health.",
            },
        ]
    else:
        offers = []

    return offers


def _get_risk_grade(total_score: int) -> str:
    if total_score >= 800:
        return "A+"
    elif total_score >= 740:
        return "A"
    elif total_score >= 680:
        return "B+"
    elif total_score >= 620:
        return "B"
    elif total_score >= 560:
        return "C"
    else:
        return "D"


def ocen_formatter_agent(state: dict) -> dict:
    """
    LangGraph node: generates final outputs.
    Input: scored state with all data
    Output: recommendation, health_card, ocen_payload, officer_dossier
    """
    try:
        total_score = state.get("total_score", 0)
        percentile = state.get("percentile", 50)
        breakdown = state.get("score_breakdown", {})
        explanations = state.get("score_explanations", {})
        payload = state.get("normalized_payload", {})
        application_id = state.get("application_id", "APP-DEMO")

        # Recommendation logic
        if total_score >= 700:
            recommendation = "APPROVE"
            confidence = min(0.99, 0.75 + (total_score - 700) / 1000)
        elif total_score >= 600:
            recommendation = "REVIEW"
            confidence = min(0.80, 0.50 + (total_score - 600) / 500)
        else:
            recommendation = "REJECT"
            confidence = min(0.95, 0.65 + (600 - total_score) / 1000)

        # Eligible loan amount
        avg_monthly_inflow = payload.get("upi_avg_monthly_inflow", 500000)
        loan_offers = _compute_loan_offers(total_score, state.get("sector", ""), avg_monthly_inflow)
        eligible_amount = loan_offers[0]["max_amount"] if loan_offers else 0
        risk_grade = _get_risk_grade(total_score)
        now = datetime.utcnow()

        # Health Card (for mobile app)
        health_card = {
            "application_id": application_id,
            "status": "complete",
            "business_name": payload.get("business_name", state.get("business_name", "")),
            "gstin": state.get("gstin", ""),
            "sector": payload.get("sector", state.get("sector", "")),
            "city": payload.get("city", ""),
            "total_score": total_score,
            "max_score": 900,
            "percentile": percentile,
            "score_breakdown": breakdown,
            "score_explanations": explanations,
            "recommendation": recommendation,
            "confidence": round(confidence, 3),
            "eligible_loan_amount": eligible_amount,
            "risk_grade": risk_grade,
            "loan_offers": loan_offers,
            "processing_completed_at": now.isoformat(),
        }

        # OCEN 4.0 payload
        ocen_payload = {
            "schema_version": "4.0",
            "application_id": application_id,
            "gstin": state.get("gstin", ""),
            "business_name": payload.get("business_name", ""),
            "sector": state.get("sector", ""),
            "financial_health_score": total_score,
            "max_score": 900,
            "score_breakdown": breakdown,
            "risk_grade": risk_grade,
            "recommendation": recommendation,
            "confidence": round(confidence, 3),
            "eligible_amount": eligible_amount,
            "data_sources": ["gst_portal", "upi_transactions", "epfo", "account_aggregator"],
            "generated_at": now.isoformat(),
            "lender_metadata": {
                "lender_id": "IDBI-001",
                "lender_name": "IDBI Bank",
                "product_type": "MSME_TERM_LOAN",
                "assessment_model": "FinPulse-v2",
                "uli_gateway": "ULI_PROD_001",
            },
        }

        # Officer Dossier (for bank officer dashboard)
        def get_color(score: int, max_score: int) -> str:
            pct = score / max_score
            if pct >= 0.75:
                return "green"
            elif pct >= 0.5:
                return "amber"
            else:
                return "red"

        officer_dossier = {
            "application_id": application_id,
            "business_name": payload.get("business_name", ""),
            "gstin": state.get("gstin", ""),
            "sector": payload.get("sector", ""),
            "city": payload.get("city", ""),
            "total_score": total_score,
            "percentile": percentile,
            "risk_grade": risk_grade,
            "recommendation": recommendation,
            "confidence": round(confidence, 3),
            "recommendation_reasoning": _get_recommendation_reasoning(
                recommendation, total_score, breakdown, payload
            ),
            "score_breakdown": [
                {"name": "GST Compliance", "score": breakdown.get("gst_compliance", 0),
                 "max": 200, "explanation": explanations.get("gst_compliance", ""),
                 "color": get_color(breakdown.get("gst_compliance", 0), 200)},
                {"name": "Cash Flow", "score": breakdown.get("cash_flow", 0),
                 "max": 250, "explanation": explanations.get("cash_flow", ""),
                 "color": get_color(breakdown.get("cash_flow", 0), 250)},
                {"name": "Business Stability", "score": breakdown.get("business_stability", 0),
                 "max": 200, "explanation": explanations.get("business_stability", ""),
                 "color": get_color(breakdown.get("business_stability", 0), 200)},
                {"name": "Growth Trajectory", "score": breakdown.get("growth_trajectory", 0),
                 "max": 150, "explanation": explanations.get("growth_trajectory", ""),
                 "color": get_color(breakdown.get("growth_trajectory", 0), 150)},
                {"name": "Repayment Capacity", "score": breakdown.get("repayment_capacity", 0),
                 "max": 100, "explanation": explanations.get("repayment_capacity", ""),
                 "color": get_color(breakdown.get("repayment_capacity", 0), 100)},
            ],
            "key_metrics": {
                "gst_filing_rate": f"{int(payload.get('gst_filing_rate', 0) * 100)}%",
                "upi_positive_months": f"{payload.get('upi_positive_months', 0)}/12",
                "epfo_employees": str(int(payload.get("epfo_avg_employees", 0))),
                "dscr": f"{payload.get('aa_dscr', 0):.1f}x",
                "tenure": f"{payload.get('epfo_tenure_years', 0)} years",
                "avg_monthly_turnover": f"₹{int(payload.get('gst_avg_monthly_turnover', 0)/100000):.1f}L",
            },
            "eligible_amount": eligible_amount,
            "loan_offers": loan_offers,
            "generated_at": now.isoformat(),
        }

        return {
            **state,
            "recommendation": recommendation,
            "confidence": round(confidence, 3),
            "health_card": health_card,
            "ocen_payload": ocen_payload,
            "officer_dossier": officer_dossier,
            "processing_status": "complete",
            "error_log": state.get("error_log", []),
        }

    except Exception as e:
        return {
            **state,
            "processing_status": "error",
            "error_log": state.get("error_log", []) + [f"OCENFormatter error: {str(e)}"],
        }


def _get_recommendation_reasoning(recommendation: str, score: int, breakdown: dict, payload: dict) -> str:
    if recommendation == "APPROVE":
        return (
            f"AI Assessment recommends APPROVAL. The applicant scores {score}/900 ({_get_risk_grade(score)} grade), "
            f"placing them in the top tier of MSME applicants. Strong indicators include: "
            f"GST compliance at {int(payload.get('gst_filing_rate', 0) * 100)}%, "
            f"{payload.get('upi_positive_months', 0)} months positive cash flow, and "
            f"a DSCR of {payload.get('aa_dscr', 0):.1f}x. "
            f"Risk is within acceptable parameters for the requested loan product."
        )
    elif recommendation == "REVIEW":
        return (
            f"AI Assessment recommends MANUAL REVIEW. The applicant scores {score}/900 ({_get_risk_grade(score)} grade). "
            f"The score falls in the borderline range where additional officer judgment is warranted. "
            f"Key areas of concern: cash flow consistency and growth trajectory. "
            f"Consider requesting additional collateral or a shorter loan tenure before approval."
        )
    else:
        return (
            f"AI Assessment recommends REJECTION. The applicant scores {score}/900 ({_get_risk_grade(score)} grade), "
            f"which falls below the minimum eligibility threshold of 600. "
            f"Critical deficiencies identified: poor GST compliance ({int(payload.get('gst_filing_rate', 0) * 100)}% filing rate), "
            f"negative cash flows in multiple months, and insufficient DSCR ({payload.get('aa_dscr', 0):.1f}x). "
            f"Advise applicant on remediation steps for reapplication in 6 months."
        )
