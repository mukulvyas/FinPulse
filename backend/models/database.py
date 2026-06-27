"""
SQLAlchemy async database models and initialization.
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./finpulse.db")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True)  # application_id e.g. APP-2024-001
    gstin = Column(String, nullable=False, index=True)
    business_name = Column(String, nullable=False)
    sector = Column(String, nullable=False)
    city = Column(String, nullable=True)
    total_score = Column(Integer, nullable=True)
    score_breakdown = Column(JSON, nullable=True)
    score_explanations = Column(JSON, nullable=True)
    percentile = Column(Integer, nullable=True)
    recommendation = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    eligible_amount = Column(Integer, nullable=True)
    requested_amount = Column(Integer, nullable=True)
    loan_offers = Column(JSON, nullable=True)
    health_card = Column(JSON, nullable=True)
    ocen_payload = Column(JSON, nullable=True)
    officer_dossier = Column(JSON, nullable=True)
    status = Column(String, default="processing")
    applicant_type = Column(String, default="NTC")  # NTC / NTB
    risk_label = Column(String, nullable=True)
    officer_decision = Column(String, nullable=True)
    officer_notes = Column(Text, nullable=True)
    sanctioned_amount = Column(Integer, nullable=True)
    decided_by = Column(String, nullable=True)
    decided_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    employee_id = Column(String, unique=True, nullable=False)
    role = Column(String, default="officer")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def init_db():
    """Initialize database and seed demo data."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed demo officer
    import bcrypt as _bcrypt
    import uuid

    def _hash_pw(pw: str) -> str:
        return _bcrypt.hashpw(pw.encode(), _bcrypt.gensalt()).decode()

    async with AsyncSessionLocal() as session:
        from sqlalchemy import select
        result = await session.execute(select(User).where(User.email == "officer@idbi.in"))
        existing = result.scalar_one_or_none()

        if not existing:
            officer = User(
                id=str(uuid.uuid4()),
                email="officer@idbi.in",
                hashed_password=_hash_pw("demo1234"),
                full_name="Rajesh Kumar",
                employee_id="IDBI-OFF-001",
                role="officer",
            )
            session.add(officer)
            await session.commit()

        # Seed 5 MSME applications
        from mock_data.gst_mock import MSME_PROFILES
        from datetime import timedelta
        import json

        SEED_APPS = [
            {
                "id": "APP-2024-001",
                "gstin": "27AABCU9603R1ZX",
                "business_name": "Raju Textiles Pvt Ltd",
                "sector": "Textile",
                "city": "Surat",
                "total_score": 742,
                "percentile": 74,
                "recommendation": "APPROVE",
                "confidence": 0.88,
                "eligible_amount": 2500000,
                "requested_amount": 2000000,
                "status": "pending",
                "applicant_type": "NTB",
                "risk_label": "High Confidence",
                "created_at": datetime.utcnow() - timedelta(hours=6),
            },
            {
                "id": "APP-2024-002",
                "gstin": "07AAECS7456M1ZA",
                "business_name": "Sharma Logistics Carriers",
                "sector": "Logistics",
                "city": "Delhi",
                "total_score": 610,
                "percentile": 52,
                "recommendation": "REVIEW",
                "confidence": 0.64,
                "eligible_amount": 1000000,
                "requested_amount": 1500000,
                "status": "pending",
                "applicant_type": "NTC",
                "risk_label": "Review Required",
                "created_at": datetime.utcnow() - timedelta(hours=4),
            },
            {
                "id": "APP-2024-003",
                "gstin": "27AADCA7592Q1ZB",
                "business_name": "Apex Manufacturing Works",
                "sector": "Manufacturing",
                "city": "Pune",
                "total_score": 815,
                "percentile": 89,
                "recommendation": "APPROVE",
                "confidence": 0.95,
                "eligible_amount": 5000000,
                "requested_amount": 3500000,
                "status": "pending",
                "applicant_type": "NTB",
                "risk_label": "High Confidence",
                "created_at": datetime.utcnow() - timedelta(hours=3),
            },
            {
                "id": "APP-2024-004",
                "gstin": "19AAHCS5690P1ZC",
                "business_name": "Sunrise Retail Enterprises",
                "sector": "Retail",
                "city": "Kolkata",
                "total_score": 580,
                "percentile": 38,
                "recommendation": "REJECT",
                "confidence": 0.82,
                "eligible_amount": 0,
                "requested_amount": 800000,
                "status": "pending",
                "applicant_type": "NTC",
                "risk_label": "Review Required",
                "created_at": datetime.utcnow() - timedelta(hours=2),
            },
            {
                "id": "APP-2024-005",
                "gstin": "27AANCA3429L1ZD",
                "business_name": "Nandini Agro Processors",
                "sector": "Agri-Processing",
                "city": "Nagpur",
                "total_score": 690,
                "percentile": 65,
                "recommendation": "REVIEW",
                "confidence": 0.71,
                "eligible_amount": 1500000,
                "requested_amount": 1200000,
                "status": "pending",
                "applicant_type": "NTC",
                "risk_label": "High Confidence",
                "created_at": datetime.utcnow() - timedelta(hours=1),
            },
        ]

        for app_data in SEED_APPS:
            result = await session.execute(
                select(Application).where(Application.id == app_data["id"])
            )
            existing_app = result.scalar_one_or_none()
            if not existing_app:
                app = Application(
                    id=app_data["id"],
                    gstin=app_data["gstin"],
                    business_name=app_data["business_name"],
                    sector=app_data["sector"],
                    city=app_data["city"],
                    total_score=app_data["total_score"],
                    percentile=app_data["percentile"],
                    recommendation=app_data["recommendation"],
                    confidence=app_data["confidence"],
                    eligible_amount=app_data["eligible_amount"],
                    requested_amount=app_data["requested_amount"],
                    status=app_data["status"],
                    applicant_type=app_data["applicant_type"],
                    risk_label=app_data["risk_label"],
                    created_at=app_data["created_at"],
                    score_breakdown={
                        "gst_compliance": int(app_data["total_score"] * 0.27),
                        "cash_flow": int(app_data["total_score"] * 0.31),
                        "business_stability": int(app_data["total_score"] * 0.22),
                        "growth_trajectory": int(app_data["total_score"] * 0.12),
                        "repayment_capacity": int(app_data["total_score"] * 0.08),
                    },
                )
                session.add(app)

        await session.commit()
