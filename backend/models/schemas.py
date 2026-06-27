"""
Pydantic v2 schemas for FinPulse API.
"""
from __future__ import annotations
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime
from typing_extensions import TypedDict


# ── Auth ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    officer_name: str
    officer_id: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    employee_id: str


# ── MSME Assessment ───────────────────────────────────────────────────────────

class MSMEAssessRequest(BaseModel):
    gstin: str
    business_name: str
    sector: str
    connected_sources: List[str] = ["gst", "upi", "epfo", "aa"]

class AssessmentResponse(BaseModel):
    application_id: str
    status: str = "processing"
    message: str = "Assessment started. Poll /msme/{application_id}/result for updates."

class ScoreBreakdown(BaseModel):
    gst_compliance: int = Field(ge=0, le=200)
    cash_flow: int = Field(ge=0, le=250)
    business_stability: int = Field(ge=0, le=200)
    growth_trajectory: int = Field(ge=0, le=150)
    repayment_capacity: int = Field(ge=0, le=100)

class ScoreExplanation(BaseModel):
    gst_compliance: str
    cash_flow: str
    business_stability: str
    growth_trajectory: str
    repayment_capacity: str

class LoanOffer(BaseModel):
    product_name: str
    max_amount: int
    interest_rate: float  # Annual %
    tenure_months: int
    emi: int
    processing_fee: float  # %
    description: str

class HealthCardResult(BaseModel):
    application_id: str
    status: str
    business_name: str
    gstin: str
    sector: str
    total_score: int
    max_score: int = 900
    percentile: int
    score_breakdown: ScoreBreakdown
    score_explanations: ScoreExplanation
    recommendation: str  # APPROVE / REVIEW / REJECT
    confidence: float
    eligible_loan_amount: int
    loan_offers: List[LoanOffer]
    processing_completed_at: Optional[datetime] = None


# ── Officer ───────────────────────────────────────────────────────────────────

class ApplicationQueueItem(BaseModel):
    application_id: str
    business_name: str
    gstin: str
    sector: str
    city: str
    total_score: int
    recommendation: str
    confidence: float
    status: str  # pending / approved / rejected / referred / flagged
    applicant_type: str  # NTC / NTB
    risk_label: str  # High Confidence / Review Required
    applied_at: datetime
    requested_amount: int
    officer_notes: Optional[str] = None

class OfficerDecisionRequest(BaseModel):
    application_id: str
    decision: str  # APPROVE / REJECT / REFER / FLAG
    notes: Optional[str] = None
    sanctioned_amount: Optional[int] = None

class OfficerDecisionResponse(BaseModel):
    application_id: str
    decision: str
    status: str
    updated_at: datetime


# ── Analytics ─────────────────────────────────────────────────────────────────

class KPIData(BaseModel):
    total_applications: int
    approval_rate: float
    avg_score: int
    ntc_approved: int
    portfolio_at_risk: float

class ScoreDistribution(BaseModel):
    range: str
    count: int
    percentage: float

class SectorApproval(BaseModel):
    sector: str
    volume: int
    approval_rate: float
    avg_score: int

class MonthlyTrend(BaseModel):
    month: str
    applications: int
    approvals: int
    avg_score: int

class PortfolioAnalytics(BaseModel):
    kpis: KPIData
    score_distribution: List[ScoreDistribution]
    sector_breakdown: List[SectorApproval]
    monthly_trends: List[MonthlyTrend]


# ── OCEN 4.0 Payload ─────────────────────────────────────────────────────────

class OCENPayload(BaseModel):
    schema_version: str = "4.0"
    application_id: str
    gstin: str
    business_name: str
    sector: str
    financial_health_score: int
    score_breakdown: Dict[str, Any]
    recommendation: str
    confidence: float
    eligible_amount: int
    risk_grade: str
    generated_at: datetime
    data_sources: List[str]
    lender_metadata: Dict[str, Any]


# ── LangGraph State ───────────────────────────────────────────────────────────

class LangGraphState(TypedDict, total=False):
    # Input
    gstin: str
    business_name: str
    sector: str
    application_id: str

    # Raw data from sources
    raw_gst_data: Optional[dict]
    raw_upi_data: Optional[dict]
    raw_epfo_data: Optional[dict]
    raw_aa_data: Optional[dict]

    # Normalized
    normalized_payload: Optional[dict]

    # Scores
    score_breakdown: Optional[dict]
    total_score: Optional[int]
    percentile: Optional[int]
    score_explanations: Optional[dict]

    # Output
    recommendation: Optional[str]
    confidence: Optional[float]
    ocen_payload: Optional[dict]
    officer_dossier: Optional[dict]
    health_card: Optional[dict]

    # Meta
    processing_status: str
    error_log: List[str]
