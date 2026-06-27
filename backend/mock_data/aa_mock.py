"""
Mock Account Aggregator (AA) data for 5 MSME profiles.
Returns bank statement summaries with DSCR estimates.
"""
from datetime import date, timedelta
import random

AA_PROFILES = {
    "27AABCU9603R1ZX": {  # Raju Textiles
        "avg_monthly_balance": 820000,
        "avg_monthly_credit": 1950000,
        "avg_monthly_debit": 1720000,
        "existing_emi": 45000,  # Monthly EMI
        "dscr": 2.1,
        "positive_months": 11,
        "bank": "State Bank of India",
    },
    "07AAECS7456M1ZA": {  # Sharma Logistics
        "avg_monthly_balance": 310000,
        "avg_monthly_credit": 980000,
        "avg_monthly_debit": 920000,
        "existing_emi": 32000,
        "dscr": 1.3,
        "positive_months": 9,
        "bank": "Punjab National Bank",
    },
    "27AADCA7592Q1ZB": {  # Apex Manufacturing
        "avg_monthly_balance": 2400000,
        "avg_monthly_credit": 3600000,
        "avg_monthly_debit": 2900000,
        "existing_emi": 85000,
        "dscr": 3.4,
        "positive_months": 12,
        "bank": "HDFC Bank",
    },
    "19AAHCS5690P1ZC": {  # Sunrise Retail
        "avg_monthly_balance": 95000,
        "avg_monthly_credit": 560000,
        "avg_monthly_debit": 545000,
        "existing_emi": 18000,
        "dscr": 0.9,
        "positive_months": 7,
        "bank": "UCO Bank",
    },
    "27AANCA3429L1ZD": {  # Nandini Agro
        "avg_monthly_balance": 560000,
        "avg_monthly_credit": 1300000,
        "avg_monthly_debit": 1100000,
        "existing_emi": 28000,
        "dscr": 1.8,
        "positive_months": 10,
        "bank": "Bank of Maharashtra",
    },
}


def get_aa_data(gstin: str) -> dict:
    """Return Account Aggregator bank statement summary for last 12 months."""
    profile = AA_PROFILES.get(gstin, AA_PROFILES["27AABCU9603R1ZX"])

    today = date.today()
    monthly_statements = []

    for i in range(12, 0, -1):
        period_date = date(today.year, today.month, 1) - timedelta(days=30 * i)
        period = period_date.strftime("%Y-%m")

        r = random.Random(hash(gstin + period + "aa"))

        seasonal_factor = 1.0
        if period_date.month in [10, 11, 12]:
            seasonal_factor = 1.2
        elif period_date.month in [1, 2]:
            seasonal_factor = 0.85

        credit = int(profile["avg_monthly_credit"] * seasonal_factor * r.uniform(0.88, 1.12))
        debit = int(profile["avg_monthly_debit"] * seasonal_factor * r.uniform(0.88, 1.12))
        opening_balance = int(profile["avg_monthly_balance"] * r.uniform(0.8, 1.2))
        closing_balance = opening_balance + credit - debit

        monthly_statements.append({
            "period": period,
            "opening_balance": opening_balance,
            "total_credit": credit,
            "total_debit": debit,
            "closing_balance": closing_balance,
            "net_flow": credit - debit,
            "is_positive": (credit - debit) > 0,
            "emi_paid": profile["existing_emi"],
            "bank_charges": r.randint(500, 2000),
        })

    positive_months = sum(1 for m in monthly_statements if m["is_positive"])
    avg_balance = sum(m["closing_balance"] for m in monthly_statements) / 12
    total_credit = sum(m["total_credit"] for m in monthly_statements)
    total_emi_paid = profile["existing_emi"] * 12

    # Monthly operating income estimate for DSCR
    monthly_operating_income = total_credit / 12

    return {
        "gstin": gstin,
        "bank_name": profile["bank"],
        "monthly_statements": monthly_statements,
        "summary": {
            "total_months": 12,
            "positive_months": positive_months,
            "avg_monthly_balance": int(avg_balance),
            "total_credit_12m": total_credit,
            "total_debit_12m": sum(m["total_debit"] for m in monthly_statements),
            "net_cashflow_12m": total_credit - sum(m["total_debit"] for m in monthly_statements),
            "existing_monthly_emi": profile["existing_emi"],
            "dscr": profile["dscr"],
            "monthly_operating_income": int(monthly_operating_income),
            "cashflow_health": round(positive_months / 12, 3),
        },
    }
