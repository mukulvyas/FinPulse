"""
Mock EPFO (Employee Provident Fund) data for 5 MSME profiles.
Returns employee count history with seasonal patterns.
"""
from datetime import date, timedelta
import random

EPFO_PROFILES = {
    "27AABCU9603R1ZX": {  # Raju Textiles
        "base_employees": 12,
        "seasonality": {"10": 14, "11": 15, "12": 14, "1": 11, "2": 10},
        "tenure_years": 7,
        "pf_compliance_rate": 0.95,
    },
    "07AAECS7456M1ZA": {  # Sharma Logistics
        "base_employees": 9,
        "seasonality": {"10": 11, "11": 12, "12": 11, "1": 8, "2": 8},
        "tenure_years": 4,
        "pf_compliance_rate": 0.82,
    },
    "27AADCA7592Q1ZB": {  # Apex Manufacturing
        "base_employees": 15,
        "seasonality": {"10": 17, "11": 18, "12": 17, "1": 14, "2": 13},
        "tenure_years": 11,
        "pf_compliance_rate": 0.98,
    },
    "19AAHCS5690P1ZC": {  # Sunrise Retail
        "base_employees": 8,
        "seasonality": {"10": 10, "11": 11, "12": 10, "1": 7, "2": 6},
        "tenure_years": 2,
        "pf_compliance_rate": 0.70,
    },
    "27AANCA3429L1ZD": {  # Nandini Agro
        "base_employees": 11,
        "seasonality": {"10": 13, "11": 14, "12": 13, "1": 9, "2": 9},
        "tenure_years": 5,
        "pf_compliance_rate": 0.88,
    },
}


def get_epfo_data(gstin: str) -> dict:
    """Return EPFO employee count history for last 24 months."""
    profile = EPFO_PROFILES.get(gstin, EPFO_PROFILES["27AABCU9603R1ZX"])

    today = date.today()
    employee_history = []

    for i in range(24, 0, -1):
        period_date = date(today.year, today.month, 1) - timedelta(days=30 * i)
        month_str = str(period_date.month)
        period = period_date.strftime("%Y-%m")

        r = random.Random(hash(gstin + period + "epfo"))

        # Seasonal employee count
        base = profile["seasonality"].get(month_str, profile["base_employees"])
        count = max(5, base + r.randint(-1, 1))

        # PF contributions
        avg_salary = r.randint(15000, 28000)
        pf_contribution = int(count * avg_salary * 0.12)
        filed = r.random() < profile["pf_compliance_rate"]

        employee_history.append({
            "period": period,
            "employee_count": count,
            "avg_salary": avg_salary,
            "pf_contribution": pf_contribution,
            "filed_on_time": filed,
        })

    avg_employees = sum(e["employee_count"] for e in employee_history) / len(employee_history)
    first_half_avg = sum(e["employee_count"] for e in employee_history[:12]) / 12
    second_half_avg = sum(e["employee_count"] for e in employee_history[12:]) / 12
    employee_growth = (second_half_avg - first_half_avg) / first_half_avg if first_half_avg > 0 else 0

    return {
        "gstin": gstin,
        "employee_history": employee_history,
        "summary": {
            "avg_employee_count": round(avg_employees, 1),
            "current_employee_count": employee_history[-1]["employee_count"],
            "employee_growth_rate": round(employee_growth, 3),
            "tenure_years": profile["tenure_years"],
            "pf_compliance_rate": profile["pf_compliance_rate"],
            "total_pf_paid_24m": sum(e["pf_contribution"] for e in employee_history),
        },
    }
