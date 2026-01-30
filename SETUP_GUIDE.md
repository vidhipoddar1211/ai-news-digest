# Setup Guide - AI-Powered News Digest

## Prerequisites Check

Before starting, ensure you have:
- Python 3.9+ installed
- PostgreSQL 12+ installed and running
- Git (optional, for version control)

### Check Python Installation
```powershell
python --version
```

### Check PostgreSQL Installation
```powershell
psql --version
```

## Step 1: Create PostgreSQL Database

### Windows Setup

**1a. Open PostgreSQL Command Prompt (psql)**
- Search for "SQL Shell" in Windows Start Menu
- Or open PowerShell and run:
```powershell
psql -U postgres
```
- Enter PostgreSQL password when prompted

**1b. Create the database and user**
```sql
-- Create a new user for the application
CREATE USER news_user WITH PASSWORD 'secure_password_123';

-- Create the database
CREATE DATABASE news_digest OWNER news_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE news_digest TO news_user;

-- Exit psql
\q
```

### Update .env file
```
DATABASE_URL=postgresql://news_user:secure_password_123@localhost:5432/news_digest
```

## Step 2: Set Up Python Virtual Environment

Navigate to the backend directory and create a virtual environment:

```powershell
cd c:\Users\vidhi\Desktop\News\backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\Activate.ps1

# If you get execution policy error, run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Step 3: Install Dependencies

```powershell
pip install -r requirements.txt
```

This installs:
- FastAPI (web framework)
- SQLAlchemy (database ORM)
- psycopg2 (PostgreSQL driver)
- Pydantic (data validation)
- Passlib & Bcrypt (password hashing)
- Python-dotenv (environment variables)
- And more...

## Step 4: Create .env File

Create `.env` file in the `backend/` directory with these values:

```
DATABASE_URL=postgresql://news_user:secure_password_123@localhost:5432/news_digest
SECRET_KEY=your-super-secret-key-change-in-production-12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=your-openai-api-key-here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-email-password
SENDER_EMAIL=your-email@gmail.com
DEBUG=True
APP_NAME=News Digest API
```

## Step 5: Run the Application

```powershell
# Make sure you're in backend directory and venv is activated
python -m uvicorn app.main:app --reload
```

**Output should look like:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process [1234]
INFO:     Waiting for application startup.
```

## Step 6: Test the API

### Option A: Swagger UI (Interactive)
Open in your browser: `http://localhost:8000/docs`

### Option B: ReDoc (Documentation)
Open in your browser: `http://localhost:8000/redoc`

### Option C: PowerShell/cURL
```powershell
# Health check
curl http://localhost:8000/health

# Register a new user
curl -X POST http://localhost:8000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'

# Get user by ID (after registration)
curl http://localhost:8000/api/auth/users/1
```

## Troubleshooting

### "ModuleNotFoundError" when running app
- Make sure virtual environment is activated
- Check: `pip list` should show FastAPI, SQLAlchemy, etc.

### "Database connection failed"
- Verify PostgreSQL is running
- Check DATABASE_URL in .env matches actual database
- Test connection: `psql -U news_user -d news_digest`

### "Port 8000 already in use"
```powershell
# Find and kill process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
python -m uvicorn app.main:app --reload --port 8001
```

### Pydantic validation errors
- Check your .env file format (no quotes needed around values)
- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`

## What Gets Created

When you run the app with the database connected, SQLAlchemy automatically creates:
- `users` table with columns: id, email, hashed_password, full_name, is_active, created_at, updated_at
- All other models you define in the future

## File Permissions (if needed)

If you get permission errors:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Next Steps

Once everything is running:
1. Test endpoints in Swagger UI
2. Create a test user via /api/auth/register
3. Retrieve user data via /api/auth/users/{id}
4. Then we'll add JWT authentication
