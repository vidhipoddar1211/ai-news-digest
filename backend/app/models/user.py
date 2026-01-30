"""
User model representing the user account entity in the database.
Stores authentication and profile information.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from datetime import datetime
from ..database import Base


class User(Base):
    """
    User table schema.
    
    Attributes:
        id: Unique user identifier (Primary Key)
        email: User's email address (Unique, used for login)
        hashed_password: Bcrypt hashed password (never store plain passwords)
        full_name: User's full name for display
        is_active: Flag to enable/disable account
        created_at: Account creation timestamp
        updated_at: Last profile update timestamp
    """
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, full_name={self.full_name})>"
