from app.database import Base, engine
from app.models import Appointment, User


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Database tables are ready.")
