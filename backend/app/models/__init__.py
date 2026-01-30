"""
SQLAlchemy ORM models representing database tables.
All models should be imported here to ensure they're registered with the Base.
"""

from .user import User

__all__ = ["User"]
