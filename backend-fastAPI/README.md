# Appointment Booking FastAPI Backend

This backend preserves the API contract used by the React frontend while replacing
the Spring Boot implementation with FastAPI.

## Setup

1. Create and activate a virtual environment:

   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

2. Install dependencies:

   ```powershell
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and set the MySQL password:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Create tables when using a new database:

   ```powershell
   python create_tables.py
   ```

   If the existing Spring Boot database is already populated, do not run this
   command against it unless the tables are missing.

5. Set a unique `JWT_SECRET_KEY` in `.env`. Use a long random value and never
   commit `.env`.

6. Start the API:

   ```powershell
   uvicorn app.main:app --reload --port 8080
   ```

Interactive API documentation is available at `http://localhost:8080/docs`.

## Create an admin account

From the `backend-fastAPI` directory, run:

```powershell
python create_admin.py
```

The CLI prompts for a username and password (twice to confirm). You can also
provide the username with `python create_admin.py --username admin`; the
password is still entered securely at the prompt. The account is created in
the configured database using the same password hashing and duplicate-username
checks as API registration.

The current user model does not distinguish admin accounts from other users.
This command provisions an account through the CLI, but does not grant it
separate permissions; any authenticated user can access the appointment
endpoints.

## Authentication

`POST /api/auth/login` and `POST /api/auth/register` return a signed JWT:

```json
{
  "message": "Login successful.",
  "username": "demo",
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

All appointment endpoints require this header:

```text
Authorization: Bearer <access_token>
```

The React frontend stores the token locally and attaches it to appointment
requests. Logging out removes the token from the browser.

## API compatibility

The backend keeps these routes unchanged:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/appointments`
- `GET /api/appointments/{id}`
- `POST /api/appointments`
- `PUT /api/appointments/{id}`
- `PATCH /api/appointments/{id}/status`
- `DELETE /api/appointments/{id}`

Appointment request and response fields remain camelCase (`patientName` and
`appointmentDate`) to avoid frontend changes.
