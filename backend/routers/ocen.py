"""
OCEN router: GET /ocen/payload/{application_id}
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.database import get_db, Application

router = APIRouter(prefix="/ocen", tags=["ocen"])


@router.get("/payload/{application_id}")
async def get_ocen_payload(application_id: str, db: AsyncSession = Depends(get_db)):
    """Return OCEN 4.0 formatted JSON for an application."""
    result = await db.execute(select(Application).where(Application.id == application_id))
    app = result.scalar_one_or_none()

    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if not app.ocen_payload:
        raise HTTPException(status_code=404, detail="OCEN payload not yet generated")

    return app.ocen_payload
