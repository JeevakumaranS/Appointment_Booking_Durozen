from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.appointment import AppointmentStatus
from app.schemas.appointment import (
    AppointmentInput,
    AppointmentResponse,
    StatusRequest,
)
from app.services.appointment_service import (
    create_appointment,
    get_appointment,
    get_appointments,
    update_appointment,
)

router = APIRouter(
    prefix="/api/appointments",
    tags=["appointments"],
    dependencies=[Depends(get_current_user)],
)


def require_appointment(db: Session, appointment_id: int):
    appointment = get_appointment(db, appointment_id)
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment not found: {appointment_id}",
        )
    return appointment


@router.get("", response_model=list[AppointmentResponse])
def list_appointments(db: Session = Depends(get_db)):
    return get_appointments(db)


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_one(appointment_id: int, db: Session = Depends(get_db)):
    return require_appointment(db, appointment_id)


@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(request: AppointmentInput, db: Session = Depends(get_db)):
    return create_appointment(db, request)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update(
    appointment_id: int,
    request: AppointmentInput,
    db: Session = Depends(get_db),
):
    appointment = require_appointment(db, appointment_id)
    return update_appointment(db, appointment, request)


@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
def update_status(
    appointment_id: int,
    request: StatusRequest,
    db: Session = Depends(get_db),
):
    appointment = require_appointment(db, appointment_id)
    if appointment.status == request.status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The appointment already has this status.",
        )
    appointment.status = AppointmentStatus(request.status)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(appointment_id: int, db: Session = Depends(get_db)):
    appointment = require_appointment(db, appointment_id)
    db.delete(appointment)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
