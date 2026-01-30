# AI-Powered Personalized News Digest

A full-stack web application that delivers personalized news summaries to users via email. Users can select topics or provide URLs, and the system fetches, summarizes, and delivers content automatically.

## Project Structure

### Backend (`/backend`)
```
backend/
├── app/
│   ├── models/           # SQLAlchemy ORM models (database tables)
│   │   └── user.py      # User account model
│   ├── schemas/         # Pydantic validation schemas
│   │   └── user.py      # User request/response schemas
│   ├── routes/          # API endpoint definitions
│   │   └── auth.py      # Authentication endpoints
│   ├── services/        # Business logic layer
│   │   └── user_service.py  # User operations
│   ├── utils/           # Utility functions
│   │   └── security.py  # Password hashing/verification
│   ├── config.py        # Configuration settings
│   ├── database.py      # Database connection & session
│   └── main.py          # FastAPI app initialization
├── requirements.txt     # Python dependencies
└── .env.example         # Environment variables template
```

### Frontend (`/frontend`)
```
frontend/
└── src/                 # React application source code
```

## Architecture Overview

### Layered Architecture
1. **Routes Layer** (`routes/`) - HTTP request handlers
2. **Services Layer** (`services/`) - Business logic and database operations
3. **Models Layer** (`models/`) - ORM models (database schema)
4. **Database Layer** (`database.py`) - Connection management
5. **Utilities** (`utils/`) - Shared helper functions

## Current Implementation Status

### ✅ Completed
- [x] Project structure and folder organization
- [x] Database configuration (PostgreSQL with SQLAlchemy)
- [x] User model with authentication fields
- [x] User schemas (Create, Read, Update)
- [x] User service with business logic
- [x] Security utilities (password hashing)
- [x] Authentication routes (register, get user)
- [x] FastAPI app initialization
- [x] CORS middleware setup

### 📋 Next Steps (To Be Implemented)
1. JWT token generation and authentication
2. Topics and URLs management models
3. Summarization preferences model
4. Feed fetching and processing service
5. AI summarization service (OpenAI integration)
6. Email scheduling and delivery
7. Frontend React components
8. Database migrations

## Setup Instructions

### Prerequisites
- Python 3.9+
- PostgreSQL 12+
- Node.js 16+ (for frontend)

### Backend Setup

1. **Create and activate virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your configuration
   # - Database URL
   # - Secret key
   # - OpenAI API key
   # - Email settings
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb news_digest
   
   # Update DATABASE_URL in .env:
   # DATABASE_URL=postgresql://username:password@localhost:5432/news_digest
   ```

5. **Run the application**
   ```bash
   # From the backend directory
   python -m uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

### API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development Rules

- **Feature-by-feature development** - Implement complete features before moving to the next
- **Clean code** - Follow PEP 8, use type hints, write docstrings
- **Modular architecture** - Keep services, models, and routes separate
- **Ask before adding libraries** - Confirm new dependencies with the user
- **Prefer simplicity** - Use straightforward solutions over complex ones

## Key Dependencies

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and serialization
- **Passlib & Bcrypt** - Password hashing and security
- **python-jose** - JWT token handling (to be implemented)
- **OpenAI** - AI summarization service
- **APScheduler** - Background task scheduling
- **PostgreSQL** - Primary database

## License

[Add your license here]
