"""
FastAPI application entry point.
Initializes the app, sets up routes, and configures middleware.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routes import auth_router
from app.models import User  # register models
from app.db_wait import wait_for_db


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Personalized News Digest API",
    version="0.1.0"
)


@app.on_event("startup")
def startup_event():
    """
    Try to create tables if database is available.
    This is optional for testing JWT endpoints.
    """
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created or already exist")
    except Exception as e:
        print(f"⚠️  Could not connect to database: {e}")
        print("   Continuing without database (JWT endpoints will still work)")


# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth_router)


@app.get("/", tags=["health"])
def read_root():
    return {
        "message": "AI-Powered Personalized News Digest API",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "app_name": settings.APP_NAME
    }
