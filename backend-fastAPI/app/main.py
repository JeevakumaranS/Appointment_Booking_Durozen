from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import settings
from app.routers import appointments, auth

app = FastAPI(title="Appointment Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=0,
)

app.include_router(auth.router)
app.include_router(appointments.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
