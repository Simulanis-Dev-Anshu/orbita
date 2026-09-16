from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings
from app.core.security import decode_token
from app.db import mongo as db
from app.db.models import User

bearer = HTTPBearer(auto_error=False)

ROLE_RANK = {"viewer": 0, "admin": 1, "owner": 2}


async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
) -> User:
    if creds is None:
        if settings.allow_public_read:
            user = await db.find_one("users", {"is_active": True})
            if user is not None:
                return user
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    payload = decode_token(creds.credentials, expected_type="access")
    if payload is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")
    user = await db.find_id("users", payload["sub"])
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found or disabled")
    return user


def require_role(minimum: str):
    """Route guard: require_role('admin') allows admin and owner."""

    async def checker(user: User = Depends(get_current_user)) -> User:
        if ROLE_RANK.get(user.role, -1) < ROLE_RANK[minimum]:
            raise HTTPException(status.HTTP_403_FORBIDDEN, f"Requires {minimum} role")
        return user

    return checker
