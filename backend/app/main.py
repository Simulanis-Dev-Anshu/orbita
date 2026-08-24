from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import agents, auth, copilot, insights, operations, telemetry
from app.core.config import settings
from app.db.base import SessionLocal, engine
from app.db.models import Base, ensure_asset_columns
from app.db.seed import seed_if_empty


@asynccontextmanager
async def lifespan(_: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(ensure_asset_columns)

    if settings.seed_demo_data:
        async with SessionLocal() as session:
            await seed_if_empty(session)

    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(operations.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(telemetry.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
