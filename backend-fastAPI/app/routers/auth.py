from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import AuthRequest, AuthResponse
from app.services.auth_service import (
    authenticate_user,
    create_user_token,
    register_user,
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(request: AuthRequest, db: Session = Depends(get_db)):
    try:
        user = register_user(db, request.username, request.password)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    return AuthResponse(
        message="User created successfully.",
        username=user.username,
        access_token=create_user_token(user),
    )


@router.post("/login", response_model=AuthResponse)
def login(request: AuthRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    return AuthResponse(
        message="Login successful.",
        username=user.username,
        access_token=create_user_token(user),
    )
