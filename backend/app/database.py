"""
Database connection and session management.
Uses SQLAlchemy ORM for PostgreSQL database operations.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator

from .config import settings

# Create database engine
# echo=True logs all SQL statements (useful for debugging)
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True  # Test connections before using them
)

# SessionLocal is used to create database sessions for each request
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all ORM models
Base = declarative_base()


def get_db() -> Generator:
    """
    Dependency function for FastAPI routes.
    Provides a database session for each request and closes it after the request.
    
    Usage in routes:
        @app.get("/users/")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    
    Yields:
        SessionLocal: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
