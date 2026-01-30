"""
User service containing business logic for user operations.
Handles user creation, authentication, and profile management.
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, OperationalError, DatabaseError
from app.models import User
from app.schemas import UserCreate, UserUpdate
from app.utils import hash_password, verify_password
from typing import Optional


class UserService:
    """
    Service class for user-related operations.
    Handles all user business logic separate from route handlers.
    """
    
    @staticmethod
    def create_user(db: Session, user_create: UserCreate) -> User:
        """
        Create a new user account.
        
        Args:
            db: Database session
            user_create: User creation schema with email and password
            
        Returns:
            Created User object
            
        Raises:
            ValueError: If email already exists or validation fails
            
        Example:
            user = UserService.create_user(db, UserCreate(
                email="user@example.com",
                password="securepass123",
                full_name="John Doe"
            ))
        """
        try:
            # Hash the password before storing
            hashed_password = hash_password(user_create.password)
            
            # Create new user object
            db_user = User(
                email=user_create.email,
                hashed_password=hashed_password,
                full_name=user_create.full_name
            )
            
            # Save to database
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
            return db_user
            
        except IntegrityError as e:
            db.rollback()
            # Check if it's a duplicate email error
            if "email" in str(e).lower() or "unique" in str(e).lower():
                raise ValueError(f"Email {user_create.email} is already registered")
            raise ValueError(f"Database constraint violation: {str(e)}")
        
        except (OperationalError, DatabaseError) as e:
            db.rollback()
            raise ValueError(f"Database connection error. Please try again later.")
        
        except Exception as e:
            db.rollback()
            raise ValueError(f"Failed to create user: {str(e)}")
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        Retrieve a user by email address.
        
        Args:
            db: Database session
            email: User's email address
            
        Returns:
            User object if found, None otherwise
            
        Example:
            user = UserService.get_user_by_email(db, "user@example.com")
        """
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """
        Retrieve a user by ID.
        
        Args:
            db: Database session
            user_id: User's unique identifier
            
        Returns:
            User object if found, None otherwise
            
        Example:
            user = UserService.get_user_by_id(db, 1)
        """
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password.
        
        Args:
            db: Database session
            email: User's email address
            password: Plain text password to verify
            
        Returns:
            User object if authentication successful, None otherwise
            
        Example:
            user = UserService.authenticate_user(db, "user@example.com", "password123")
            if user:
                print(f"Welcome back, {user.full_name}!")
        """
        user = UserService.get_user_by_email(db, email)
        
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        if not user.is_active:
            return None
        
        return user
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """
        Update a user's profile information.
        
        Args:
            db: Database session
            user_id: User's unique identifier
            user_update: Updated user data
            
        Returns:
            Updated User object if successful, None if user not found
            
        Example:
            updated_user = UserService.update_user(db, 1, UserUpdate(
                full_name="Jane Doe"
            ))
        """
        user = UserService.get_user_by_id(db, user_id)
        
        if not user:
            return None
        
        # Update only provided fields
        if user_update.email is not None:
            user.email = user_update.email
        
        if user_update.full_name is not None:
            user.full_name = user_update.full_name
        
        if user_update.password is not None:
            user.hashed_password = hash_password(user_update.password)
        
        db.commit()
        db.refresh(user)
        
        return user
