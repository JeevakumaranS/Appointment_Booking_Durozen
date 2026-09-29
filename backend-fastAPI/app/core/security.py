from datetime import datetime, timedelta, timezone

from passlib.context import CryptContext
from jose import JWTError, jwt

from app.database import settings


password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_context.verify(password, hashed_password)


def create_access_token(username: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.jwt_expire_minutes,
    )
    payload = {
        "sub": username,
        "exp": expires_at,
    }
    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def get_username_from_token(token: str) -> str:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        username = payload.get("sub")
        if not isinstance(username, str) or not username:
            raise ValueError("Token subject is missing.")
        return username
    except (JWTError, ValueError) as error:
        raise ValueError("Invalid or expired token.") from error
