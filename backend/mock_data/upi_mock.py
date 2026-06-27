"""
Mock UPI transaction data for 5 MSME profiles.
Returns 12 months of daily cash flow data with realistic Indian amounts.
"""
from datetime import date, timedelta
import random

UPI_PROFILES = {
    "27AABCU9603R1ZX": {  # Raju Textiles
        "avg_daily_inflow": 62000,
        "avg_daily_outflow": 45000,
        "volatility": 0.25,
        "positive_months": 11,
    },
    "07AAECS7456M1ZA": {  # Sharma Logistics
        "avg_daily_inflow": 31000,
        "avg_daily_outflow": 26000,
        "volatility": 0.40,
        "positive_months": 9,
    },
    "27AADCA7592Q1ZB": {  # Apex Manufacturing
        "avg_daily_inflow": 115000,
        "avg_daily_outflow": 78000,
        "volatility": 0.18,
        "positive_months": 12,
    },
    "19AAHCS5690P1ZC": {  # Sunrise Retail
        "avg_daily_inflow": 18000,
        "avg_daily_outflow": 17500,
        "volatility": 0.55,
        "positive_months": 7,
    },
    "27AANCA3429L1ZD": {  # Nandini Agro
        "avg_daily_inflow": 42000,
        "avg_daily_outflow": 32000,
        "volatility": 0.35,
        "positive_months": 10,
    },
}


def get_upi_data(gstin: str) -> dict:
    """Return 12 months of daily UPI transactions."""
    profile = UPI_PROFILES.get(gstin, UPI_PROFILES["27AABCU9603R1ZX"])

    today = date.today()
    daily_transactions = []
    monthly_summaries = []

    # Generate 365 days
    start_date = today - timedelta(days=365)
    current_month = None
    month_inflow = 0
    month_outflow = 0
    month_days = 0

    for day_offset in range(365):
        txn_date = start_date + timedelta(days=day_offset)
        r = random.Random(hash(gstin + txn_date.isoformat()))

        # Weekend slight reduction
        weekend_factor = 0.7 if txn_date.weekday() >= 5 else 1.0

        # Seasonal factor
        month_num = txn_date.month
        seasonal_factor = 1.0
        if month_num in [10, 11, 12]:
            seasonal_factor = 1.25
        elif month_num in [1, 2]:
            seasonal_factor = 0.8
        elif month_num in [6, 7]:  # Monsoon dip for logistics/retail
            seasonal_factor = 0.9

        base_inflow = profile["avg_daily_inflow"] * weekend_factor * seasonal_factor
        base_outflow = profile["avg_daily_outflow"] * weekend_factor * seasonal_factor

        inflow = max(5000, int(base_inflow * r.uniform(1 - profile["volatility"], 1 + profile["volatility"])))
        outflow = max(3000, int(base_outflow * r.uniform(1 - profile["volatility"] * 0.5, 1 + profile["volatility"] * 0.5)))
        net = inflow - outflow

        daily_transactions.append({
            "date": txn_date.isoformat(),
            "inflow": inflow,
            "outflow": outflow,
            "net": net,
            "transaction_count": r.randint(3, 25),
        })

        # Monthly aggregation
        month_key = txn_date.strftime("%Y-%m")
        if current_month != month_key:
            if current_month is not None:
                monthly_summaries.append({
                    "month": current_month,
                    "total_inflow": month_inflow,
                    "total_outflow": month_outflow,
                    "net_flow": month_inflow - month_outflow,
                    "is_positive": (month_inflow - month_outflow) > 0,
                    "days": month_days,
                })
            current_month = month_key
            month_inflow = inflow
            month_outflow = outflow
            month_days = 1
        else:
            month_inflow += inflow
            month_outflow += outflow
            month_days += 1

    # Last month
    if current_month:
        monthly_summaries.append({
            "month": current_month,
            "total_inflow": month_inflow,
            "total_outflow": month_outflow,
            "net_flow": month_inflow - month_outflow,
            "is_positive": (month_inflow - month_outflow) > 0,
            "days": month_days,
        })

    positive_months = sum(1 for m in monthly_summaries if m["is_positive"])
    total_inflow = sum(d["inflow"] for d in daily_transactions)
    total_outflow = sum(d["outflow"] for d in daily_transactions)
    avg_monthly_inflow = int(total_inflow / 12)

    # YoY UPI growth (compare first 6 months vs last 6 months)
    first_half = sum(d["inflow"] for d in daily_transactions[:182])
    second_half = sum(d["inflow"] for d in daily_transactions[182:])
    upi_growth = (second_half - first_half) / first_half if first_half > 0 else 0

    return {
        "gstin": gstin,
        "daily_transactions": daily_transactions[-90:],  # Last 90 days for performance
        "monthly_summaries": monthly_summaries,
        "summary": {
            "total_months": len(monthly_summaries),
            "positive_months": positive_months,
            "total_inflow_12m": total_inflow,
            "total_outflow_12m": total_outflow,
            "net_flow_12m": total_inflow - total_outflow,
            "avg_monthly_inflow": avg_monthly_inflow,
            "avg_daily_inflow": int(total_inflow / 365),
            "upi_growth_rate": round(upi_growth, 3),
            "cashflow_health": round(positive_months / len(monthly_summaries), 3),
        },
    }
