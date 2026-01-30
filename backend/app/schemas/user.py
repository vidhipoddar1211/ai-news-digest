"""
Pydantic models for user-related API requests and responses.
These validate incoming data and define response structures.
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr = Field(..., description="User's email address")
    full_name: Optional[str] = Field(None, description="User's full name")


class UserCreate(UserBase):
    """
    Schema for creating a new user (user registration).
    
    Attributes:
        email: Email address (must be valid and unique)
        password: Plain text password (will be hashed before storage)
        full_name: Optional full name
    """
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")


class UserUpdate(BaseModel):
    """
    Schema for updating user profile.
    All fields are optional.
    
    Attributes:
        email: New email address (optional)
        full_name: New full name (optional)
        password: New password (optional, minimum 8 characters)
    """
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)


class UserRead(UserBase):
    """
    Schema for returning user data in API responses.
    Never returns passwords in responses.
    
    Attributes:
        id: User's unique identifier
        email: User's email address
        full_name: User's full name
        is_active: Whether the account is active
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # Allows reading from ORM models


class LoginRequest(BaseModel):
    """
    Schema for user login.
    
    Attributes:
        email: User's email address
        password: User's password (plain text, will be verified against hashed)
    """
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")


class TokenResponse(BaseModel):
    """
    Schema for OAuth2 token response.
    
    Must contain access_token and token_type fields for OAuth2 compatibility.
    Swagger UI automatically handles this response format.
    
    Attributes:
        access_token: JWT access token string
        token_type: Type of token (always "bearer")
    """
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type (always bearer)")
