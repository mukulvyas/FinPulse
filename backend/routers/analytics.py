"""
Analytics router: GET /analytics/portfolio
"""
from fastapi import APIRouter
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["analytics"])

# Static analytics data based on the 5 mock MSME profiles + broader portfolio
MOCK_PORTFOLIO_DATA = {
    "kpis": {
        "total_applications": 247,
        "approval_rate": 0.68,
        "avg_score": 687,
        "ntc_approved": 89,
        "portfolio_at_risk": 4.2,
    },
    "score_distribution": [
        {"range": "<600", "count": 31, "percentage": 12.5},
        {"range": "600-649", "count": 48, "percentage": 19.4},
        {"range": "650-699", "count": 62, "percentage": 25.1},
        {"range": "700-749", "count": 72, "percentage": 29.1},
        {"range": "750-800", "count": 24, "percentage": 9.7},
        {"range": ">800", "count": 10, "percentage": 4.0},
    ],
    "sector_breakdown": [
        {"sector": "Manufacturing", "volume": 78, "approval_rate": 0.72, "avg_score": 714},
        {"sector": "Retail Trading", "volume": 54, "approval_rate": 0.58, "avg_score": 641},
        {"sector": "Logistics", "volume": 42, "approval_rate": 0.61, "avg_score": 655},
        {"sector": "Textile", "volume": 38, "approval_rate": 0.74, "avg_score": 722},
        {"sector": "IT Services", "volume": 21, "approval_rate": 0.81, "avg_score": 748},
        {"sector": "Agri-Processing", "volume": 14, "approval_rate": 0.64, "avg_score": 672},
    ],
    "monthly_trends": [
        {"month": "Jan 2024", "applications": 18, "approvals": 12, "avg_score": 671},
        {"month": "Feb 2024", "applications": 15, "approvals": 10, "avg_score": 683},
        {"month": "Mar 2024", "applications": 22, "approvals": 15, "avg_score": 692},
        {"month": "Apr 2024", "applications": 19, "approvals": 13, "avg_score": 678},
        {"month": "May 2024", "applications": 25, "approvals": 17, "avg_score": 701},
        {"month": "Jun 2024", "applications": 28, "approvals": 19, "avg_score": 688},
        {"month": "Jul 2024", "applications": 24, "approvals": 16, "avg_score": 695},
        {"month": "Aug 2024", "applications": 31, "approvals": 21, "avg_score": 712},
        {"month": "Sep 2024", "applications": 27, "approvals": 18, "avg_score": 704},
        {"month": "Oct 2024", "applications": 21, "approvals": 14, "avg_score": 698},
        {"month": "Nov 2024", "applications": 18, "approvals": 12, "avg_score": 685},
        {"month": "Dec 2024", "applications": 14, "approvals": 10, "avg_score": 671},
    ],
    "recent_decisions": [
        {"business": "Apex Machining Works", "app_id": "APP-2023-892", "score": 785, "amount": "₹25,00,000", "decision": "Approved"},
        {"business": "Sunrise Retail Pvt Ltd", "app_id": "APP-2023-891", "score": 640, "amount": "₹10,00,000", "decision": "Pending Review"},
        {"business": "Global Logistics Co.", "app_id": "APP-2023-889", "score": 580, "amount": "₹50,00,000", "decision": "Declined"},
        {"business": "Nandini Agro Processors", "app_id": "APP-2023-888", "score": 710, "amount": "₹15,50,000", "decision": "Approved"},
        {"business": "Raju Textiles Pvt Ltd", "app_id": "APP-2023-887", "score": 742, "amount": "₹20,00,000", "decision": "Approved"},
    ],
}


@router.get("/portfolio")
async def get_portfolio_analytics():
    """Return KPI summary, score distribution, sector breakdown, and trends."""
    return MOCK_PORTFOLIO_DATA
