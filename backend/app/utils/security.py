"""
Security utilities for password hashing and verification.
Uses bcrypt for secure password storage.
"""

from passlib.context import CryptContext

# Initialize bcrypt context
# Using bcrypt algorithm with automatic salt generation
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    
    Args:
        password: Plain text password to hash
        
    Returns:
        Hashed password string
        
    Example:
        hashed = hash_password("mypassword123")
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Previously hashed password to compare against
        
    Returns:
        True if password matches, False otherwise
        
    Example:
        if verify_password("mypassword123", hashed_password):
            print("Password is correct!")
    """
    return pwd_context.verify(plain_password, hashed_password)
