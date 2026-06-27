"""
Agent 2 — ScoringAgent
Computes multidimensional Financial Health Score (0-900) with explanations.
"""
import math


def _calculate_gst_compliance_score(payload: dict) -> tuple[int, str]:
    """GST Compliance Score (0-200): filing punctuality and consistency."""
    filing_rate = payload.get("gst_filing_rate", 0)
    on_time_rate = payload.get("gst_on_time_rate", 0)
    filed_count = payload.get("gst_filed_count", 0)

    # 70% weight on filing rate, 30% on on-time rate
    raw = (filing_rate * 0.7 + on_time_rate * 0.3) * 200
    score = min(200, int(raw))

    if score >= 170:
        explanation = f"Excellent GST compliance — {int(filing_rate * 100)}% returns filed with {int(on_time_rate * 100)}% on-time submissions. This signals strong financial discipline and regulatory adherence."
        color = "green"
    elif score >= 130:
        explanation = f"Good GST compliance — {int(filing_rate * 100)}% returns filed with occasional minor delays. A few missed filings slightly impact the score but do not indicate systemic risk."
        color = "amber"
    elif score >= 80:
        explanation = f"Moderate GST compliance — only {int(filing_rate * 100)}% returns filed. Multiple missed filings suggest cash flow pressure or administrative gaps requiring attention."
        color = "amber"
    else:
        explanation = f"Poor GST compliance — only {int(filing_rate * 100)}% returns filed, with significant delays. This is a high-risk indicator for loan eligibility and requires immediate remediation."
        color = "red"

    return score, explanation


def _calculate_cash_flow_score(payload: dict) -> tuple[int, str]:
    """Cash Flow Score (0-250): UPI inflow velocity and positive months."""
    positive_months = payload.get("upi_positive_months", 0)
    cashflow_health = payload.get("upi_cashflow_health", 0)
    avg_monthly_inflow = payload.get("upi_avg_monthly_inflow", 0)
    net_flow = payload.get("upi_net_flow_12m", 0)

    # Health is primary (60%), absolute inflow adds up to 40%
    inflow_factor = min(1.0, avg_monthly_inflow / 1500000)  # Normalize to ₹15L/month
    raw = (cashflow_health * 0.6 + inflow_factor * 0.4) * 250
    score = min(250, int(raw))

    monthly_inflow_l = avg_monthly_inflow / 100000
    if score >= 200:
        explanation = f"Strong cash flow — {positive_months} out of 12 months showed positive net cash flow, with average monthly UPI inflow of ₹{monthly_inflow_l:.1f}L. Business demonstrates healthy liquidity."
        color = "green"
    elif score >= 140:
        explanation = f"Adequate cash flow — {positive_months} positive months with ₹{monthly_inflow_l:.1f}L average monthly inflow. Minor volatility observed but overall cash position is manageable."
        color = "amber"
    elif score >= 80:
        explanation = f"Strained cash flow — only {positive_months} positive months. Average monthly inflow of ₹{monthly_inflow_l:.1f}L with frequent negative months indicates cash management challenges."
        color = "amber"
    else:
        explanation = f"Critical cash flow concerns — {positive_months} positive months with low inflow of ₹{monthly_inflow_l:.1f}L. Business is at risk of default if additional debt obligations are added."
        color = "red"

    return score, explanation


def _calculate_business_stability_score(payload: dict) -> tuple[int, str]:
    """Business Stability Score (0-200): EPFO trend, tenure, and PF compliance."""
    tenure_years = payload.get("epfo_tenure_years", 0)
    pf_compliance = payload.get("epfo_pf_compliance", 0)
    employee_growth = payload.get("epfo_employee_growth", 0)
    avg_employees = payload.get("epfo_avg_employees", 0)

    # Tenure (40%), PF compliance (40%), employee growth (20%)
    tenure_factor = min(1.0, tenure_years / 10)  # Max benefit at 10+ years
    growth_factor = min(1.0, max(0, (employee_growth + 0.1) / 0.3))  # -10% to +20% range
    raw = (tenure_factor * 0.4 + pf_compliance * 0.4 + growth_factor * 0.2) * 200
    score = min(200, int(raw))

    if score >= 160:
        explanation = f"Highly stable business — {tenure_years} years of operation with {int(pf_compliance * 100)}% PF compliance. Consistent workforce of ~{int(avg_employees)} employees demonstrates operational maturity."
        color = "green"
    elif score >= 110:
        explanation = f"Reasonably stable — {tenure_years} years in operation with {int(pf_compliance * 100)}% PF compliance. Employee count shows minor seasonal variation which is expected for this sector."
        color = "amber"
    elif score >= 60:
        explanation = f"Moderate stability concerns — {tenure_years} years of operation but only {int(pf_compliance * 100)}% PF compliance. Workforce fluctuations suggest operational instability."
        color = "amber"
    else:
        explanation = f"Low business stability — limited tenure of {tenure_years} years with poor PF compliance at {int(pf_compliance * 100)}%. High-risk indicator for sustained loan repayment."
        color = "red"

    return score, explanation


def _calculate_growth_trajectory_score(payload: dict) -> tuple[int, str]:
    """Growth Trajectory Score (0-150): YoY invoice and UPI growth."""
    invoice_growth = payload.get("invoice_yoy_growth", 0)
    upi_growth = payload.get("upi_growth_rate", 0)

    # Average of two growth indicators, normalized to 0-1 scale
    # -20% to +40% maps to 0 to 1
    combined_growth = (invoice_growth * 0.6 + upi_growth * 0.4)
    growth_factor = min(1.0, max(0, (combined_growth + 0.2) / 0.6))
    score = min(150, int(growth_factor * 150))

    growth_pct = round(invoice_growth * 100, 1)
    upi_growth_pct = round(upi_growth * 100, 1)
    if score >= 120:
        explanation = f"Strong growth trajectory — invoice turnover grew {growth_pct}% YoY with {upi_growth_pct}% UPI transaction growth. Business is expanding rapidly and demonstrates strong market demand."
        color = "green"
    elif score >= 80:
        explanation = f"Positive growth — {growth_pct}% YoY invoice growth with {upi_growth_pct}% UPI growth. Steady expansion indicates a stable and growing customer base."
        color = "green"
    elif score >= 40:
        explanation = f"Flat growth — {growth_pct}% YoY change with {upi_growth_pct}% UPI growth. Business is maintaining but not expanding, which is a neutral indicator."
        color = "amber"
    else:
        explanation = f"Declining trajectory — {growth_pct}% YoY revenue change with {upi_growth_pct}% UPI growth. Contracting business activity raises concerns about future repayment capacity."
        color = "red"

    return score, explanation


def _calculate_repayment_capacity_score(payload: dict) -> tuple[int, str]:
    """Repayment Capacity Score (0-100): DSCR from AA data."""
    dscr = payload.get("aa_dscr", 0)
    aa_cashflow_health = payload.get("aa_cashflow_health", 0)
    monthly_emi = payload.get("aa_monthly_emi", 0)
    avg_balance = payload.get("aa_avg_monthly_balance", 0)

    # DSCR is the primary metric (70%), balance health (30%)
    dscr_factor = min(1.0, max(0, (dscr - 0.5) / 3.0))  # 0.5 to 3.5 range
    raw = (dscr_factor * 0.7 + aa_cashflow_health * 0.3) * 100
    score = min(100, int(raw))

    if score >= 75:
        explanation = f"Strong repayment capacity — DSCR of {dscr:.1f}x comfortably exceeds the minimum threshold of 1.25x. Bank balance of ₹{int(avg_balance/100000):.1f}L provides adequate repayment buffer."
        color = "green"
    elif score >= 50:
        explanation = f"Adequate repayment capacity — DSCR of {dscr:.1f}x meets minimum requirements with room for new EMI obligations. Existing EMI of ₹{int(monthly_emi/1000)}K manageable."
        color = "amber"
    elif score >= 25:
        explanation = f"Tight repayment capacity — DSCR of {dscr:.1f}x is near the minimum threshold. Existing EMI commitments of ₹{int(monthly_emi/1000)}K leave limited room for additional debt."
        color = "amber"
    else:
        explanation = f"Insufficient repayment capacity — DSCR of {dscr:.1f}x is below the acceptable threshold of 1.0x. Current EMI commitments are stretching the business's financial resources."
        color = "red"

    return score, explanation


def _compute_percentile(total_score: int, sector: str) -> int:
    """Estimate percentile rank vs sector peers."""
    # Distribution assumption: normal distribution around sector means
    sector_means = {
        "textile": 670, "logistics": 640, "manufacturing": 700,
        "retail": 620, "agri-processing": 650,
    }
    mean = sector_means.get(sector.lower(), 660)
    std = 80

    # Z-score and approximate percentile
    z = (total_score - mean) / std
    # Approximate CDF using logistic function
    percentile = int(100 / (1 + math.exp(-1.7 * z)))
    return max(5, min(95, percentile))


def scoring_agent(state: dict) -> dict:
    """
    LangGraph node: computes multidimensional score.
    Input: normalized_payload
    Output: score_breakdown, total_score, percentile, score_explanations
    """
    payload = state.get("normalized_payload", {})
    sector = state.get("sector", payload.get("sector", "manufacturing"))

    try:
        gst_score, gst_exp = _calculate_gst_compliance_score(payload)
        cash_flow_score, cash_exp = _calculate_cash_flow_score(payload)
        stability_score, stability_exp = _calculate_business_stability_score(payload)
        growth_score, growth_exp = _calculate_growth_trajectory_score(payload)
        repayment_score, repayment_exp = _calculate_repayment_capacity_score(payload)

        total = gst_score + cash_flow_score + stability_score + growth_score + repayment_score

        breakdown = {
            "gst_compliance": gst_score,
            "cash_flow": cash_flow_score,
            "business_stability": stability_score,
            "growth_trajectory": growth_score,
            "repayment_capacity": repayment_score,
        }

        explanations = {
            "gst_compliance": gst_exp,
            "cash_flow": cash_exp,
            "business_stability": stability_exp,
            "growth_trajectory": growth_exp,
            "repayment_capacity": repayment_exp,
        }

        percentile = _compute_percentile(total, sector)

        return {
            **state,
            "score_breakdown": breakdown,
            "total_score": total,
            "percentile": percentile,
            "score_explanations": explanations,
            "processing_status": "scored",
            "error_log": state.get("error_log", []),
        }

    except Exception as e:
        return {
            **state,
            "processing_status": "error",
            "error_log": state.get("error_log", []) + [f"Scoring error: {str(e)}"],
        }
