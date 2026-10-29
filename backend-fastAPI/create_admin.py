import argparse
import getpass
import sys

from pydantic import ValidationError

from app.database import SessionLocal
from app.schemas.auth import AuthRequest
from app.services.auth_service import register_user


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Create an account for the appointment booking API.",
    )
    parser.add_argument(
        "--username",
        help="Account username (prompted if omitted).",
    )
    args = parser.parse_args()

    username = args.username or input("Username: ")
    password = getpass.getpass("Password: ")
    confirmation = getpass.getpass("Confirm password: ")

    if password != confirmation:
        print("Passwords do not match.", file=sys.stderr)
        return 1

    try:
        request = AuthRequest(username=username.strip(), password=password)
    except ValidationError as error:
        messages = "; ".join(issue["msg"] for issue in error.errors())
        print(f"Invalid account details: {messages}", file=sys.stderr)
        return 1

    try:
        with SessionLocal() as db:
            user = register_user(db, request.username, request.password)
    except ValueError as error:
        print(str(error), file=sys.stderr)
        return 1

    print(f"User Account '{user.username}' created successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
