"""
Authentication and user management routes.
Handles user registration, login, token generation, and protected endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserRead, TokenResponse
from app.services import UserService
from app.utils import create_access_token
from app.security import get_current_user

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user account.
    
    No authentication required.
    
    Args:
        user_data: User registration data (email, password, full_name)
        db: Database session (injected by FastAPI)
        
    Returns:
        Created user information (without password)
        
    Raises:
        HTTPException 400: If email already exists or validation fails
        HTTPException 500: If an unexpected error occurs
        
    Example:
        POST /api/auth/register
        {
            "email": "user@example.com",
            "password": "securepass123",
            "full_name": "John Doe"
        }
    """
    try:
        user = UserService.create_user(db, user_data)
        return user
    except ValueError as e:
        # Handle expected errors (duplicate email, validation errors)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Catch any unexpected errors and return 500 with a message
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login endpoint - authenticate user and return JWT token.
    
    OAuth2 password flow compatible.
    
    Args:
        form_data: Username (email) and password as form data
        db: Database session
        
    Returns:
        TokenResponse with access_token and token_type
        
    Raises:
        HTTPException 401: If email/password combination is invalid
        
    Example:
        POST /api/auth/login
        Form Data:
            username: user@example.com
            password: securepass123
        
        Response:
        {
            "access_token": "eyJhbGc...",
            "token_type": "bearer"
        }
    """
    # form_data.username contains the email
    # Authenticate user with email and password
    user = UserService.authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        # Return generic error to prevent email enumeration attacks
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT token
    # Using user.id as the "subject" (sub) claim
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer"
    )


@router.get("/users/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve user information by ID.
    
    **PROTECTED:** Requires valid JWT token in Authorization header.
    
    Only authenticated users can access this endpoint.
    Users can only view their own profile or other users' profiles (based on your requirements).
    
    Args:
        user_id: User's unique identifier
        current_user: Currently authenticated user (injected by dependency)
        db: Database session (injected by FastAPI)
        
    Returns:
        User information
        
    Raises:
        HTTPException 401: If not authenticated or token invalid
        HTTPException 404: If user not found
        
    Example:
        GET /api/auth/users/1
        Headers: {
            "Authorization": "Bearer eyJhbGc..."
        }
    """
    user = UserService.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get("/me", response_model=UserRead)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get the current authenticated user's profile.
    
    **PROTECTED:** Requires valid JWT token in Authorization header.
    
    This is a convenience endpoint to get your own profile without knowing your user ID.
    
    Args:
        current_user: Currently authenticated user (injected by dependency)
        
    Returns:
        Current user's information
        
    Example:
        GET /api/auth/me
        Headers: {
            "Authorization": "Bearer eyJhbGc..."
        }
    """
    return current_user
