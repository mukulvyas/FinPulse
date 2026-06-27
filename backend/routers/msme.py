"""
MSME router: POST /msme/assess, GET /msme/{id}/result
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid

from models.database import get_db, Application
from models.schemas import MSMEAssessRequest, AssessmentResponse, HealthCardResult

router = APIRouter(prefix="/msme", tags=["msme"])


async def run_pipeline_background(
    application_id: str,
    gstin: str,
    business_name: str,
    sector: str,
    db_session_factory,
):
    """Run the LangGraph pipeline in the background and update DB."""
    from agents.graph import run_assessment
    from models.database import AsyncSessionLocal

    result = await run_assessment(gstin, business_name, sector, application_id)

    async with AsyncSessionLocal() as db:
        stmt = select(Application).where(Application.id == application_id)
        res = await db.execute(stmt)
        app = res.scalar_one_or_none()

        if app and result.get("processing_status") == "complete":
            health_card = result.get("health_card", {})
            app.status = "complete"
            app.total_score = result.get("total_score")
            app.score_breakdown = result.get("score_breakdown")
            app.score_explanations = result.get("score_explanations")
            app.percentile = result.get("percentile")
            app.recommendation = result.get("recommendation")
            app.confidence = result.get("confidence")
            app.eligible_amount = health_card.get("eligible_loan_amount", 0)
            app.loan_offers = health_card.get("loan_offers", [])
            app.health_card = health_card
            app.ocen_payload = result.get("ocen_payload")
            app.officer_dossier = result.get("officer_dossier")
            app.city = health_card.get("city", "")
            app.risk_label = "High Confidence" if (result.get("confidence", 0) or 0) >= 0.75 else "Review Required"
            app.updated_at = datetime.utcnow()
            await db.commit()
        elif app:
            app.status = "error"
            await db.commit()


@router.post("/assess", response_model=AssessmentResponse)
async def assess_msme(
    request: MSMEAssessRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    # Check if GSTIN already processed recently
    from mock_data.gst_mock import MSME_PROFILES
    profile = MSME_PROFILES.get(request.gstin)
    resolved_name = profile["business_name"] if profile else request.business_name
    resolved_sector = profile["sector"] if profile else request.sector

    application_id = f"APP-2024-{str(uuid.uuid4())[:6].upper()}"

    app = Application(
        id=application_id,
        gstin=request.gstin,
        business_name=resolved_name,
        sector=resolved_sector,
        status="processing",
        applicant_type="NTB",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(app)
    await db.commit()

    background_tasks.add_task(
        run_pipeline_background,
        application_id,
        request.gstin,
        resolved_name,
        resolved_sector,
        None,
    )

    return AssessmentResponse(application_id=application_id)


@router.get("/{application_id}/result")
async def get_result(application_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).where(Application.id == application_id))
    app = result.scalar_one_or_none()

    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if app.status == "processing":
        return {"application_id": application_id, "status": "processing"}

    if app.status == "error":
        return {"application_id": application_id, "status": "error", "message": "Processing failed"}

    return app.health_card or {
        "application_id": application_id,
        "status": app.status,
        "total_score": app.total_score,
        "recommendation": app.recommendation,
    }
