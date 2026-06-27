"""
Officer router: GET /officer/queue, POST /officer/decision
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from models.database import get_db, Application
from models.schemas import OfficerDecisionRequest, OfficerDecisionResponse, ApplicationQueueItem

router = APIRouter(prefix="/officer", tags=["officer"])


@router.get("/queue")
async def get_queue(db: AsyncSession = Depends(get_db)):
    """Return list of pending applications for officer review."""
    result = await db.execute(
        select(Application)
        .where(Application.status.in_(["pending", "complete"]))
        .order_by(Application.created_at.desc())
    )
    applications = result.scalars().all()

    queue = []
    for app in applications:
        dossier = app.officer_dossier or {}
        queue.append({
            "application_id": app.id,
            "business_name": app.business_name,
            "gstin": app.gstin,
            "sector": app.sector,
            "city": app.city or "—",
            "total_score": app.total_score or 0,
            "recommendation": app.recommendation or "REVIEW",
            "confidence": app.confidence or 0.5,
            "status": app.status,
            "applicant_type": app.applicant_type or "NTC",
            "risk_label": app.risk_label or "Review Required",
            "applied_at": app.created_at.isoformat() if app.created_at else datetime.utcnow().isoformat(),
            "requested_amount": app.requested_amount or 1000000,
            "officer_notes": app.officer_notes,
            "score_breakdown": app.score_breakdown or {},
            "officer_dossier": dossier,
            "eligible_amount": app.eligible_amount or 0,
        })

    return {"applications": queue, "total": len(queue)}


@router.get("/application/{application_id}")
async def get_application_detail(application_id: str, db: AsyncSession = Depends(get_db)):
    """Return full dossier for a specific application."""
    result = await db.execute(select(Application).where(Application.id == application_id))
    app = result.scalar_one_or_none()

    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    return {
        "application_id": app.id,
        "business_name": app.business_name,
        "gstin": app.gstin,
        "sector": app.sector,
        "city": app.city,
        "total_score": app.total_score,
        "percentile": app.percentile,
        "recommendation": app.recommendation,
        "confidence": app.confidence,
        "status": app.status,
        "applicant_type": app.applicant_type,
        "risk_label": app.risk_label,
        "score_breakdown": app.score_breakdown,
        "score_explanations": app.score_explanations,
        "requested_amount": app.requested_amount,
        "eligible_amount": app.eligible_amount,
        "loan_offers": app.loan_offers or [],
        "officer_dossier": app.officer_dossier or {},
        "officer_decision": app.officer_decision,
        "officer_notes": app.officer_notes,
        "decided_at": app.decided_at.isoformat() if app.decided_at else None,
        "created_at": app.created_at.isoformat() if app.created_at else None,
    }


@router.post("/decision", response_model=OfficerDecisionResponse)
async def submit_decision(
    request: OfficerDecisionRequest,
    db: AsyncSession = Depends(get_db),
):
    """Save officer decision for an application."""
    result = await db.execute(select(Application).where(Application.id == request.application_id))
    app = result.scalar_one_or_none()

    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    decision_map = {
        "APPROVE": "approved",
        "REJECT": "rejected",
        "REFER": "referred",
        "FLAG": "flagged",
    }

    app.officer_decision = request.decision
    app.officer_notes = request.notes
    app.sanctioned_amount = request.sanctioned_amount
    app.status = decision_map.get(request.decision, "reviewed")
    app.decided_at = datetime.utcnow()
    app.decided_by = "IDBI-OFF-001"

    await db.commit()

    return OfficerDecisionResponse(
        application_id=app.id,
        decision=request.decision,
        status=app.status,
        updated_at=app.decided_at,
    )
