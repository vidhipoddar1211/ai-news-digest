"""
JWT token generation and verification.
Handles creation and validation of JWT access tokens.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from ..config import settings


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Dictionary containing the data to encode in the token
              (typically {"sub": user_id, "email": user_email})
        expires_delta: Custom expiration time. If None, uses default from settings.
        
    Returns:
        Encoded JWT token string
        
    Example:
        token = create_access_token({"sub": 1, "email": "user@example.com"})
    """
    # Make a copy to avoid modifying the original dict
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    # Add expiration to token data
    to_encode.update({"exp": expire})
    
    # Encode token with secret key and algorithm
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def verify_access_token(token: str) -> Optional[str]:
    """
    Verify and decode a JWT access token.
    
    Args:
        token: JWT token string to verify
        
    Returns:
        User ID (subject) if token is valid, None if invalid
        
    Raises:
        JWTError: If token is invalid or expired
        
    Example:
        user_id = verify_access_token("eyJhbGc...")
        if user_id:
            # Token is valid
    """
    try:
        # Decode token
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        # Extract subject (user_id)
        user_id: str = payload.get("sub")
        
        if user_id is None:
            return None
            
        return user_id
        
    except JWTError:
        # Token is invalid or expired
        return None


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode a JWT token and return the payload.
    
    Args:
        token: JWT token string
        
    Returns:
        Token payload dictionary if valid, None if invalid
        
    Example:
        payload = decode_token("eyJhbGc...")
        if payload:
            user_id = payload.get("sub")
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
