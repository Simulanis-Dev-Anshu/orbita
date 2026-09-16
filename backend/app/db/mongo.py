"""MongoDB (Motor) connection and document helpers."""
from __future__ import annotations

from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase

from app.core.config import settings
from app.db.models import Obj, as_obj

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


def db() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("MongoDB is not connected")
    return _db


def col(name: str) -> AsyncIOMotorCollection:
    return db()[name]


async def connect_mongo() -> None:
    global _client, _db
    uri = settings.mongodb_uri_resolved
    if "<db_password>" in uri:
        raise RuntimeError(
            "Set MONGODB_PASSWORD in backend/.env to your Atlas password "
            "(the URI still contains <db_password>)."
        )
    _client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=8000)
    _db = _client[settings.mongodb_db]
    await _client.admin.command("ping")
    await ensure_indexes()


async def close_mongo() -> None:
    global _client, _db
    if _client is not None:
        _client.close()
    _client = None
    _db = None


async def ping() -> bool:
    try:
        await db().command("ping")
        return True
    except Exception:  # noqa: BLE001
        return False


async def ensure_indexes() -> None:
    await col("users").create_index("email", unique=True)
    await col("agents").create_index("external_key", unique=True, sparse=True)
    await col("agents").create_index("risk")
    await col("agents").create_index("status")
    await col("agents").create_index("discovery_kind")
    await col("connectors").create_index("name", unique=True)
    await col("connectors").create_index("kind")
    await col("connector_tokens").create_index("connector_id", unique=True)
    await col("agent_events").create_index("occurred_at")
    await col("inventory_snapshots").create_index("captured_on", unique=True)


async def get_db():
    yield db()


async def find_id(collection: str, item_id: str) -> Obj | None:
    raw = await col(collection).find_one({"_id": item_id})
    if raw is None:
        raw = await col(collection).find_one({"id": item_id})
    return as_obj(raw)


async def find_one(collection: str, query: dict[str, Any]) -> Obj | None:
    return as_obj(await col(collection).find_one(query))


async def find_many(
    collection: str,
    query: dict[str, Any] | None = None,
    *,
    sort: list[tuple[str, int]] | None = None,
) -> list[Obj]:
    cursor = col(collection).find(query or {})
    if sort:
        cursor = cursor.sort(sort)
    return [as_obj(doc) async for doc in cursor]


async def insert(collection: str, obj: Obj) -> Obj:
    await col(collection).insert_one(obj.to_mongo())
    return obj


async def insert_many(collection: str, rows: list[dict[str, Any]]) -> None:
    if not rows:
        return
    await col(collection).insert_many(rows, ordered=False)


async def save(collection: str, obj: Obj) -> Obj:
    await col(collection).replace_one({"_id": obj.id}, obj.to_mongo(), upsert=True)
    return obj


async def delete_id(collection: str, item_id: str) -> bool:
    res = await col(collection).delete_one({"_id": item_id})
    return res.deleted_count > 0


async def count(collection: str, query: dict[str, Any] | None = None) -> int:
    return await col(collection).count_documents(query or {})
