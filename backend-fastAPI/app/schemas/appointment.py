from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.appointment import AppointmentStatus


class AppointmentInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    patient_name: str = Field(alias="patientName", min_length=1)
    email: EmailStr
    phone: str = Field(pattern=r"^\d{10}$")
    appointment_date: date = Field(alias="appointmentDate")
    reason: str = Field(min_length=1, max_length=1000)


class AppointmentResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True,
    )

    patient_name: str = Field(alias="patientName")
    email: EmailStr
    phone: str
    appointment_date: date = Field(alias="appointmentDate")
    reason: str
    id: int
    status: AppointmentStatus


class StatusRequest(BaseModel):
    status: AppointmentStatus
