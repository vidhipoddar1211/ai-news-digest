"""
Configuration settings for the News Digest application.
Loads environment variables and provides centralized config management.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    Attributes:
        DATABASE_URL: PostgreSQL connection string
        SECRET_KEY: JWT secret key for token generation
        ALGORITHM: Algorithm used for JWT encoding (HS256)
        ACCESS_TOKEN_EXPIRE_MINUTES: JWT token expiration time in minutes
        OPENAI_API_KEY: API key for OpenAI services
        SMTP_SERVER: Email server hostname
        SMTP_PORT: Email server port
        SMTP_USERNAME: Email account username
        SMTP_PASSWORD: Email account password
        SENDER_EMAIL: From address for sent emails
        DEBUG: Debug mode flag
        APP_NAME: Application name
    """
    
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    OPENAI_API_KEY: Optional[str] = None
    
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SENDER_EMAIL: Optional[str] = None
    
    DEBUG: bool = True
    APP_NAME: str = "News Digest API"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
