import time
from sqlalchemy.exc import OperationalError
from .database import engine


def wait_for_db(retries: int = 3, delay: int = 2):
    for attempt in range(retries):
        try:
            engine.connect()
            print("✅ Database is ready")
            return
        except OperationalError:
            print(f"⏳ Waiting for database... ({attempt + 1}/{retries})")
            time.sleep(delay)

    # Log warning but continue - tables will be created on first connection
    print("⚠️  Database not ready, but continuing with startup...")

