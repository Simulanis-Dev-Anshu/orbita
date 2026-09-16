from fastapi import APIRouter

from app.core.config import settings
from app.db.mongo import ping

router = APIRouter(tags=["operations"])


@router.get("/health")
async def health():
    ok = await ping()
    return {
        "status": "ok" if ok else "degraded",
        "service": settings.app_name,
        "database": "mongodb",
    }


@router.get("")
async def root():
    return {
        "name": settings.app_name,
        "docs": "/docs",
        "health": "/api/health",
    }
