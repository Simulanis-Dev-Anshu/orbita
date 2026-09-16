"""Kept so old imports of get_session still resolve to the Mongo database."""
from app.db.mongo import get_db as get_session

__all__ = ["get_session"]
