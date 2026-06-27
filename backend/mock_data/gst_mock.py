"""
Mock GST data for 5 MSME profiles.
Returns 24 months of GST filing history with realistic Indian business data.
"""
from datetime import date, timedelta
import random

# Seeded for reproducibility
random.seed(42)

MSME_PROFILES = {
    "27AABCU9603R1ZX": {  # Raju Textiles - Surat (Score: 742)
        "business_name": "Raju Textiles Pvt Ltd",
        "sector": "textile",
        "city": "Surat",
        "gstin": "27AABCU9603R1ZX",
        "filing_rate": 0.92,
        "avg_monthly_turnover": 1850000,  # ₹18.5L/month
        "yoy_growth": 0.18,
    },
    "07AAECS7456M1ZA": {  # Sharma Logistics - Delhi (Score: 610)
        "business_name": "Sharma Logistics Carriers",
        "sector": "logistics",
        "city": "Delhi",
        "gstin": "07AAECS7456M1ZA",
        "filing_rate": 0.75,
        "avg_monthly_turnover": 920000,  # ₹9.2L/month
        "yoy_growth": 0.05,
    },
    "27AADCA7592Q1ZB": {  # Apex Manufacturing - Pune (Score: 815)
        "business_name": "Apex Manufacturing Works",
        "sector": "manufacturing",
        "city": "Pune",
        "gstin": "27AADCA7592Q1ZB",
        "filing_rate": 0.96,
        "avg_monthly_turnover": 3400000,  # ₹34L/month
        "yoy_growth": 0.28,
    },
    "19AAHCS5690P1ZC": {  # Sunrise Retail - Kolkata (Score: 580)
        "business_name": "Sunrise Retail Enterprises",
        "sector": "retail",
        "city": "Kolkata",
        "gstin": "19AAHCS5690P1ZC",
        "filing_rate": 0.63,
        "avg_monthly_turnover": 540000,  # ₹5.4L/month
        "yoy_growth": -0.03,
    },
    "27AANCA3429L1ZD": {  # Nandini Agro - Nagpur (Score: 690)
        "business_name": "Nandini Agro Processors",
        "sector": "agri-processing",
        "city": "Nagpur",
        "gstin": "27AANCA3429L1ZD",
        "filing_rate": 0.83,
        "avg_monthly_turnover": 1250000,  # ₹12.5L/month
        "yoy_growth": 0.12,
    },
}


def get_gst_data(gstin: str) -> dict:
    """Return 24 months of GST filing history for a given GSTIN."""
    profile = MSME_PROFILES.get(gstin)
    if not profile:
        # Default profile for unknown GSTINs
        profile = MSME_PROFILES["27AABCU9603R1ZX"]

    today = date.today()
    filing_history = []

    for i in range(24, 0, -1):
        period_date = date(today.year, today.month, 1) - timedelta(days=30 * i)
        period = period_date.strftime("%Y-%m")

        # Determine if filed (based on filing_rate)
        r = random.Random(hash(gstin + period))
        filed = r.random() < profile["filing_rate"]

        # Due date is 20th of the following month
        due_day = period_date.replace(day=20) + timedelta(days=31)
        due_day = due_day.replace(day=20)

        # Filing date: on time or slightly late
        if filed:
            delay = r.randint(0, 8) if r.random() < 0.3 else 0
            filing_date = (due_day + timedelta(days=delay)).isoformat()
            on_time = delay <= 3
        else:
            filing_date = None
            on_time = False

        # Invoice volume: seasonal variation
        seasonal_factor = 1.0
        if period_date.month in [10, 11, 12]:  # Festival season
            seasonal_factor = 1.3
        elif period_date.month in [1, 2]:  # Post-festival dip
            seasonal_factor = 0.8

        turnover = int(
            profile["avg_monthly_turnover"]
            * seasonal_factor
            * r.uniform(0.85, 1.15)
        )
        invoice_count = max(10, int(turnover / 15000 * r.uniform(0.9, 1.1)))
        tax_paid = int(turnover * 0.18)

        filing_history.append({
            "period": period,
            "due_date": due_day.isoformat(),
            "filed": filed,
            "filing_date": filing_date,
            "on_time": on_time,
            "turnover": turnover,
            "invoice_count": invoice_count,
            "tax_paid": tax_paid,
            "status": "Filed" if filed else "Not Filed",
        })

    # Calculate summary stats
    filed_count = sum(1 for f in filing_history if f["filed"])
    on_time_count = sum(1 for f in filing_history if f["on_time"])
    total_turnover = sum(f["turnover"] for f in filing_history)
    prev_year_turnover = sum(f["turnover"] for f in filing_history[:12])
    curr_year_turnover = sum(f["turnover"] for f in filing_history[12:])
    yoy_growth = (curr_year_turnover - prev_year_turnover) / prev_year_turnover if prev_year_turnover > 0 else 0

    return {
        "gstin": gstin,
        "business_name": profile["business_name"],
        "sector": profile["sector"],
        "city": profile["city"],
        "filing_history": filing_history,
        "summary": {
            "total_months": 24,
            "filed_count": filed_count,
            "on_time_count": on_time_count,
            "filing_rate": round(filed_count / 24, 3),
            "on_time_rate": round(on_time_count / max(filed_count, 1), 3),
            "total_turnover_24m": total_turnover,
            "avg_monthly_turnover": int(total_turnover / 24),
            "yoy_growth": round(yoy_growth, 3),
        },
    }
