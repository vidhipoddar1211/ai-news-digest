# Step-by-Step Setup Instructions

Complete setup guide with all commands needed to get the application running.

## Prerequisites Verification

### Step 0A: Check Python
```powershell
python --version
```

Expected output: `Python 3.9.x` or higher

If not installed: Download from https://www.python.org/downloads/

### Step 0B: Check PostgreSQL
```powershell
psql --version
```

Expected output: `psql (PostgreSQL) 12.x or higher`

If not installed: Download from https://www.postgresql.org/download/windows/

---

## Phase 1: Database Setup

### Step 1: Open PostgreSQL

**Method A: Using SQL Shell (Easiest)**
1. Search "SQL Shell" in Windows Start Menu
2. Click it
3. Press Enter for: Server, Database, Port, Username
4. Enter password for PostgreSQL superuser

**Method B: Using PowerShell**
```powershell
psql -U postgres
```

### Step 2: Create Database User and Database

**Copy and paste these commands into psql:**

```sql
-- Create application user
CREATE USER news_user WITH PASSWORD 'secure_password_123';

-- Create database owned by the user
CREATE DATABASE news_digest OWNER news_user;

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE news_digest TO news_user;

-- Exit psql
\q
```

Expected output:
```
CREATE ROLE
CREATE DATABASE
GRANT
```

### Step 3: Verify Database Connection

```powershell
psql -U news_user -d news_digest
```

If successful, you'll see: `news_digest=>`

Then exit:
```sql
\q
```

---

## Phase 2: Python Environment Setup

### Step 4: Navigate to Backend

```powershell
cd c:\Users\vidhi\Desktop\News\backend
```

Verify you're in correct directory:
```powershell
Get-Location  # Should show: C:\Users\vidhi\Desktop\News\backend
```

### Step 5: Create Virtual Environment

```powershell
python -m venv venv
```

This creates a `venv` folder with isolated Python environment.

### Step 6: Activate Virtual Environment

```powershell
venv\Scripts\Activate.ps1
```

Expected: Prompt changes to show `(venv)` prefix

```
(venv) PS C:\Users\vidhi\Desktop\News\backend>
```

**If you get execution policy error:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try activate again.

### Step 7: Install Python Packages

```powershell
pip install -r requirements.txt
```

This installs all dependencies listed in requirements.txt:
- FastAPI (web framework)
- SQLAlchemy (database ORM)
- Psycopg2 (PostgreSQL connector)
- Pydantic (data validation)
- And more...

Expected output ends with: `Successfully installed ...`

### Step 8: Verify Installation

```powershell
pip list
```

Should see: FastAPI, SQLAlchemy, psycopg2-binary, Pydantic, etc.

---

## Phase 3: Configuration

### Step 9: Verify .env File

Check if `.env` already exists:

```powershell
Test-Path .\.env
```

If `True`: File exists ✓
If `False`: It will be created in Step 10

### Step 10: Create/Update .env File

The `.env` file should already exist in the backend folder.

Verify it contains:
```
DATABASE_URL=postgresql://news_user:secure_password_123@localhost:5432/news_digest
SECRET_KEY=dev-secret-key-change-in-production-12345abcde
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=sk-your-openai-api-key-here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=your-email@gmail.com
DEBUG=True
APP_NAME=News Digest API
```

---

## Phase 4: Run Application

### Step 11: Start FastAPI Server

Make sure:
1. You're in `c:\Users\vidhi\Desktop\News\backend`
2. Virtual environment is activated (see `(venv)` in prompt)
3. PostgreSQL is running

Then run:

```powershell
python -m uvicorn app.main:app --reload
```

**Expected output:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✓ **Server is now running!**

---

## Phase 5: Verify Setup with Tests

### Step 12: Test in Browser (Swagger UI)

Keep the server running and open a NEW PowerShell or browser.

**Open in browser:**
```
http://localhost:8000/docs
```

You should see:
- Swagger UI interface
- List of endpoints (/, /health, /api/auth/register, /api/auth/users/{user_id})
- Green "Try it out" buttons on each endpoint

### Step 13: Quick Health Check

In Swagger UI:
1. Find `GET /health`
2. Click it to expand
3. Click "Try it out"
4. Click "Execute"
5. See response:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "app_name": "News Digest API"
   }
   ```

If you see this → **Database connection successful!** ✓

### Step 14: Test User Registration

1. Find `POST /api/auth/register`
2. Click "Try it out"
3. Paste test data:
   ```json
   {
     "email": "testuser@example.com",
     "password": "password123",
     "full_name": "Test User"
   }
   ```
4. Click "Execute"
5. Response should be 201 Created with user data

### Step 15: Test User Retrieval

1. Find `GET /api/auth/users/{user_id}`
2. Click "Try it out"
3. Enter: `1`
4. Click "Execute"
5. You should get the user you just created

✓ **All endpoints working!**

---

## Phase 6: Alternative Testing Methods

### Option A: PowerShell Testing

**In a new PowerShell (server still running):**

```powershell
# Test health
curl http://localhost:8000/health

# Register user
$body = @{
    email = "alice@example.com"
    password = "password123"
    full_name = "Alice Smith"
} | ConvertTo-Json

curl -X POST http://localhost:8000/api/auth/register `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

# Get user
curl http://localhost:8000/api/auth/users/1
```

### Option B: Python Script Testing

**In a new PowerShell (server still running):**

```powershell
python test_api.py
```

This runs the included test script that:
- Tests health endpoints
- Creates a user
- Retrieves user data
- Shows formatted responses

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
```powershell
# Make sure virtual environment is activated
venv\Scripts\Activate.ps1

# Reinstall packages
pip install -r requirements.txt
```

### Issue: "Could not connect to database"

**Check 1: PostgreSQL running?**
```powershell
# Open Services app (Windows+R → services.msc)
# Look for "postgresql-x64-14" or similar
# Should show "Running"
```

**Check 2: Correct DATABASE_URL?**
```powershell
# Open .env file
# Verify: postgresql://news_user:secure_password_123@localhost:5432/news_digest
# Match your actual password set in Step 2
```

**Check 3: User exists?**
```powershell
psql -U postgres

# In psql:
SELECT * FROM pg_user WHERE usename = 'news_user';

# Should see news_user listed
```

### Issue: "Port 8000 already in use"

**Solution:**
```powershell
# Option 1: Kill the process
Get-Process | Where-Object {$_.Port -eq 8000}
Stop-Process -Name "python" -Force

# Option 2: Use different port
python -m uvicorn app.main:app --reload --port 8001
```

### Issue: Swagger UI shows empty/no endpoints

**Solution:**
1. Check server is running (see uvicorn output)
2. Hard refresh browser: Ctrl+Shift+R
3. Clear browser cache

### Issue: "Email already exists" error on registration

**Solution:**
Use a different email address in the POST request body.

---

## Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `news_digest` created
- [ ] User `news_user` created
- [ ] Python 3.9+ installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (pip install -r requirements.txt)
- [ ] .env file exists with correct DATABASE_URL
- [ ] FastAPI server running (http://localhost:8000)
- [ ] Swagger UI accessible (http://localhost:8000/docs)
- [ ] Health endpoint returns 200 OK
- [ ] User registration works
- [ ] User retrieval works

---

## Next Steps

Once verification complete:

1. **Understand the codebase** - Read through ARCHITECTURE.md
2. **JWT Authentication** - Add token generation and validation
3. **Topics Management** - Create models for news topics
4. **URL Management** - Store and manage user URLs
5. **Summarization** - Integrate OpenAI API
6. **Scheduling** - APScheduler for daily digests
7. **Email Delivery** - Send emails with summaries

---

## Quick Reference Commands

```powershell
# Activate virtual environment
cd c:\Users\vidhi\Desktop\News\backend
venv\Scripts\Activate.ps1

# Run server
python -m uvicorn app.main:app --reload

# Run tests
python test_api.py

# Check database
psql -U news_user -d news_digest

# Deactivate virtual environment
deactivate
```

---

## File Locations

```
Project Root:
c:\Users\vidhi\Desktop\News\

Backend:
c:\Users\vidhi\Desktop\News\backend\

Key Files:
- app/main.py        (FastAPI entry point)
- app/models/user.py (Database model)
- app/routes/auth.py (Endpoints)
- app/services/user_service.py (Business logic)
- .env               (Configuration)
- requirements.txt   (Dependencies)
```

---

**That's it! You now have a working FastAPI backend with user authentication (without JWT yet). Next step: Add JWT tokens for secure login.**
