from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.appointment import Appointment, AppointmentStatus
from app.schemas.appointment import AppointmentInput


def get_appointments(db: Session) -> list[Appointment]:
    return list(db.scalars(select(Appointment)).all())


def get_appointment(db: Session, appointment_id: int) -> Appointment | None:
    return db.get(Appointment, appointment_id)


def create_appointment(db: Session, request: AppointmentInput) -> Appointment:
    appointment = Appointment(
        patient_name=request.patient_name,
        email=request.email,
        phone=request.phone,
        appointment_date=request.appointment_date,
        reason=request.reason,
        status=AppointmentStatus.PENDING,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


def update_appointment(
    db: Session,
    appointment: Appointment,
    request: AppointmentInput,
) -> Appointment:
    appointment.patient_name = request.patient_name
    appointment.email = request.email
    appointment.phone = request.phone
    appointment.appointment_date = request.appointment_date
    appointment.reason = request.reason
    db.commit()
    db.refresh(appointment)
    return appointment
