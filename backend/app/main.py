from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import agents, auth, copilot, discovery, insights, operations, telemetry
from app.core.config import settings
from app.db.mongo import close_mongo, connect_mongo
from app.db.seed import seed_if_empty


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_mongo()
    if settings.seed_demo_data:
        await seed_if_empty()
    yield
    await close_mongo()


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
app.include_router(discovery.router, prefix="/api")
