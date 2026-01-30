"""
FastAPI dependencies for authentication.
Extracts and validates JWT tokens from requests.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import User
from app.utils import verify_access_token

# OAuth2PasswordBearer scheme for automatic Swagger integration
# tokenUrl should be the full path to the login endpoint
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    scopes={"read": "Read access", "write": "Write access"}
)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to extract and validate the current user from JWT token.
    
    This is used to protect routes that require authentication.
    Swagger UI will automatically show a lock icon on protected routes.
    
    Args:
        token: JWT token extracted from Authorization header by oauth2_scheme
        db: Database session
        
    Returns:
        Authenticated User object
        
    Raises:
        HTTPException 401: If token is invalid, expired, or user not found
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = verify_access_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Optional dependency to get current user (doesn't fail if not authenticated).
    
    Returns:
        User object if authenticated, None otherwise
    """
    if not token:
        return None
    
    user_id = verify_access_token(token)
    
    if user_id is None:
        return None
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if user is None or not user.is_active:
        return None
    
    return user
