from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(tags=["operations"])


@router.get("/health")
async def health():
    return {"status": "ok", "service": settings.app_name}


@router.get("")
async def root():
    return {
        "name": settings.app_name,
        "docs": "/docs",
        "health": "/api/health",
    }
