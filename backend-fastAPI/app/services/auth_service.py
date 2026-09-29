from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User


def register_user(db: Session, username: str, password: str) -> User:
    username = username.strip()
    existing_user = db.scalar(select(User).where(User.username == username))

    if existing_user:
        raise ValueError("Username already exists.")

    user = User(username=username, password=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = db.scalar(select(User).where(User.username == username.strip()))
    if not user or not verify_password(password, user.password):
        return None
    return user


def create_user_token(user: User) -> str:
    return create_access_token(user.username)
