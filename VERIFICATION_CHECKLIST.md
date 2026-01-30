# Setup Verification Checklist

Complete checklist to verify the entire setup is working correctly.

---

## 📋 Pre-Setup Requirements

- [ ] Python 3.9 or higher installed
  - Verify: `python --version` → Should show Python 3.9+
  
- [ ] PostgreSQL 12 or higher installed
  - Verify: `psql --version` → Should show psql version 12+

- [ ] Have administrator access to PostgreSQL
  - Can open SQL Shell or psql as postgres user

- [ ] Project files downloaded/cloned
  - Files exist in: `c:\Users\vidhi\Desktop\News\`

---

## 🗄️ Phase 1: PostgreSQL Database Setup

### Step 1: Create PostgreSQL User
- [ ] Open SQL Shell or psql
- [ ] Run: `CREATE USER news_user WITH PASSWORD 'secure_password_123';`
- [ ] Expected output: `CREATE ROLE`

### Step 2: Create Database
- [ ] Run: `CREATE DATABASE news_digest OWNER news_user;`
- [ ] Expected output: `CREATE DATABASE`

### Step 3: Grant Privileges
- [ ] Run: `GRANT ALL PRIVILEGES ON DATABASE news_digest TO news_user;`
- [ ] Expected output: `GRANT`

### Step 4: Verify Connection
- [ ] Run: `psql -U news_user -d news_digest`
- [ ] Should see: `news_digest=>`
- [ ] Run: `\q` to exit
- [ ] Exit psql

### Step 5: Verify Database Exists
- [ ] Open fresh psql: `psql -U postgres`
- [ ] Run: `\l` (list databases)
- [ ] Should see `news_digest` in the list
- [ ] Run: `\q`

---

## 🐍 Phase 2: Python Environment Setup

### Step 6: Navigate to Backend
- [ ] Open PowerShell
- [ ] Run: `cd c:\Users\vidhi\Desktop\News\backend`
- [ ] Verify prompt shows: `C:\Users\vidhi\Desktop\News\backend`

### Step 7: Create Virtual Environment
- [ ] Run: `python -m venv venv`
- [ ] Should create `venv` folder
- [ ] Verify: `Test-Path .\venv` returns `True`

### Step 8: Activate Virtual Environment
- [ ] Run: `venv\Scripts\Activate.ps1`
- [ ] Verify prompt shows: `(venv) PS C:\Users\vidhi\Desktop\News\backend>`
- [ ] **NOTE:** If error about execution policy:
  - [ ] Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
  - [ ] Then retry activation

### Step 9: Verify Activation
- [ ] Run: `python --version`
- [ ] Should show: `Python 3.9.x` or higher
- [ ] Run: `pip --version`
- [ ] Should show: `pip X.X.X from ... (python 3.9)`

### Step 10: Install Dependencies
- [ ] Run: `pip install -r requirements.txt`
- [ ] Wait for installation to complete
- [ ] Should end with: `Successfully installed ...`

### Step 11: Verify Installation
- [ ] Run: `pip list`
- [ ] Should see:
  - [ ] FastAPI
  - [ ] uvicorn
  - [ ] SQLAlchemy
  - [ ] psycopg2-binary
  - [ ] pydantic
  - [ ] passlib
  - [ ] bcrypt
  - [ ] And others...

---

## ⚙️ Phase 3: Configuration

### Step 12: Verify .env File Exists
- [ ] In backend folder, verify `.env` file exists
- [ ] Run: `Test-Path .\.env`
- [ ] Should return: `True`

### Step 13: Check .env Content
- [ ] Open `.env` file in editor
- [ ] Verify it contains:
  - [ ] `DATABASE_URL=postgresql://news_user:...`
  - [ ] `SECRET_KEY=...`
  - [ ] `ALGORITHM=HS256`
  - [ ] `DEBUG=True`
  - [ ] And other settings

### Step 14: Verify Database Connection String
- [ ] Check line: `DATABASE_URL=postgresql://news_user:secure_password_123@localhost:5432/news_digest`
- [ ] Verify:
  - [ ] Username: `news_user`
  - [ ] Password: `secure_password_123` (what you set in Step 1)
  - [ ] Host: `localhost`
  - [ ] Port: `5432` (default PostgreSQL)
  - [ ] Database: `news_digest`

---

## 🚀 Phase 4: Running the Application

### Step 15: Ensure Prerequisites
- [ ] Virtual environment is ACTIVATED (see `(venv)` in prompt)
- [ ] You're in correct directory: `c:\Users\vidhi\Desktop\News\backend`
- [ ] PostgreSQL is RUNNING (check Windows Services)

### Step 16: Start FastAPI Server
- [ ] Run: `python -m uvicorn app.main:app --reload`
- [ ] Wait for output to show:
  - [ ] `INFO:     Uvicorn running on http://127.0.0.1:8000`
  - [ ] `INFO:     Started server process`
  - [ ] `INFO:     Application startup complete`

### Step 17: Verify Server is Running
- [ ] Check terminal shows: "Application startup complete"
- [ ] Check no errors in terminal output
- [ ] Leave server running in terminal

---

## ✅ Phase 5: Health Checks

### Step 18: Test Root Endpoint
- [ ] Open new browser tab
- [ ] Navigate to: `http://localhost:8000/`
- [ ] Should see JSON response:
  ```json
  {
    "message": "AI-Powered Personalized News Digest API",
    "status": "running",
    "version": "0.1.0"
  }
  ```

### Step 19: Test Health Endpoint
- [ ] Navigate to: `http://localhost:8000/health`
- [ ] Should see JSON response:
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "app_name": "News Digest API"
  }
  ```
- [ ] **CRITICAL:** Must see `"database": "connected"` ✓

### Step 20: Access Swagger UI
- [ ] Navigate to: `http://localhost:8000/docs`
- [ ] Should see Swagger interface with:
  - [ ] "News Digest API" title
  - [ ] List of endpoints
  - [ ] Green/blue buttons for endpoints
  - [ ] "Try it out" buttons on each endpoint

---

## 📝 Phase 6: Endpoint Testing (Swagger UI)

### Step 21: Test Health Endpoint in Swagger
- [ ] In Swagger UI, expand `GET /health`
- [ ] Click "Try it out"
- [ ] Click "Execute"
- [ ] Should see:
  - [ ] Response Code: `200`
  - [ ] Response body shows `"database": "connected"`

### Step 22: Register First User
- [ ] Expand `POST /api/auth/register`
- [ ] Click "Try it out"
- [ ] Enter request body:
  ```json
  {
    "email": "testuser1@example.com",
    "password": "password123",
    "full_name": "Test User One"
  }
  ```
- [ ] Click "Execute"
- [ ] Should see:
  - [ ] Response Code: `201` (Created)
  - [ ] Response contains: `"id": 1`
  - [ ] Response contains: `"email": "testuser1@example.com"`
  - [ ] Response does NOT contain password hash
  - [ ] Note the returned `id` value: ___

### Step 23: Get Registered User
- [ ] Expand `GET /api/auth/users/{user_id}`
- [ ] Click "Try it out"
- [ ] Enter parameter: `user_id: 1`
- [ ] Click "Execute"
- [ ] Should see:
  - [ ] Response Code: `200`
  - [ ] Response shows same data as registration
  - [ ] Email: `testuser1@example.com`
  - [ ] Full name: `Test User One`
  - [ ] is_active: `true`

### Step 24: Try Invalid User ID
- [ ] Still in `GET /api/auth/users/{user_id}`
- [ ] Enter parameter: `user_id: 999`
- [ ] Click "Execute"
- [ ] Should see:
  - [ ] Response Code: `404` (Not Found)
  - [ ] Detail message: "User not found"

### Step 25: Try Duplicate Email
- [ ] Go to `POST /api/auth/register`
- [ ] Click "Try it out" (again)
- [ ] Enter same email as Step 22:
  ```json
  {
    "email": "testuser1@example.com",
    "password": "password123",
    "full_name": "Another User"
  }
  ```
- [ ] Click "Execute"
- [ ] Should see:
  - [ ] Response Code: `400` (Bad Request)
  - [ ] Detail message: mentions "already exists"

### Step 26: Register Second User
- [ ] Go to `POST /api/auth/register`
- [ ] Click "Try it out"
- [ ] Enter new user data:
  ```json
  {
    "email": "testuser2@example.com",
    "password": "password456",
    "full_name": "Test User Two"
  }
  ```
- [ ] Click "Execute"
- [ ] Should see:
  - [ ] Response Code: `201`
  - [ ] Response contains: `"id": 2`
  - [ ] Email: `testuser2@example.com`

### Step 27: Get Second User
- [ ] Go to `GET /api/auth/users/{user_id}`
- [ ] Click "Try it out"
- [ ] Enter: `user_id: 2`
- [ ] Click "Execute"
- [ ] Should see second user's data

---

## 🗄️ Phase 7: Database Verification

### Step 28: Verify Users in Database
- [ ] Open new PowerShell window
- [ ] Run: `psql -U news_user -d news_digest`
- [ ] Password: `secure_password_123`
- [ ] Run: `SELECT id, email, full_name, is_active FROM users;`
- [ ] Should see:
  ```
  id | email                  | full_name      | is_active
  ---|------------------------|----------------|----------
  1  | testuser1@example.com | Test User One  | t
  2  | testuser2@example.com | Test User Two  | t
  ```

### Step 29: Check Password Hashing
- [ ] While in psql, run: `SELECT id, email, hashed_password FROM users LIMIT 1;`
- [ ] Verify password looks like: `$2b$12$...` (bcrypt hash)
- [ ] NOT plain text!
- [ ] Exit: `\q`

---

## 📚 Documentation Review

### Step 30: Review Documentation
- [ ] Read: [QUICK_SUMMARY.md](QUICK_SUMMARY.md) ✓
- [ ] Read: [ARCHITECTURE.md](ARCHITECTURE.md) ✓
- [ ] Skim: [TESTING_GUIDE.md](TESTING_GUIDE.md) ✓
- [ ] Skim: [SWAGGER_UI_GUIDE.md](SWAGGER_UI_GUIDE.md) ✓

---

## 🎯 Final Verification

### Server Running
- [ ] FastAPI server still running in terminal?
- [ ] Terminal shows no errors?
- [ ] Can still access http://localhost:8000/docs?

### Database Connected
- [ ] Health endpoint shows `"database": "connected"`?
- [ ] Users table exists in PostgreSQL?
- [ ] Test users visible in database?

### API Functional
- [ ] Can register users?
- [ ] Can retrieve users?
- [ ] Can handle errors (404, 400)?
- [ ] Can validate input (422)?

### Documentation Clear
- [ ] Understand the layered architecture?
- [ ] Know where each file is located?
- [ ] Understand how requests flow through system?

---

## ✨ Success Criteria

You've successfully completed setup when **ALL** of these are true:

- [x] PostgreSQL database `news_digest` created
- [x] PostgreSQL user `news_user` created
- [x] Virtual environment created and activated
- [x] All Python packages installed
- [x] `.env` file configured with correct DATABASE_URL
- [x] FastAPI server running without errors
- [x] Swagger UI accessible at `http://localhost:8000/docs`
- [x] Health endpoint returns `"database": "connected"`
- [x] Can register users via POST /api/auth/register
- [x] Can retrieve users via GET /api/auth/users/{id}
- [x] Users table exists in PostgreSQL with data
- [x] Passwords are bcrypt hashed (not plain text)
- [x] Understand the project structure
- [x] Understand request flow through layers
- [x] Understand database schema

---

## 🚨 Troubleshooting Quick Links

If you have issues at any step:

| Step Range | Issue | Documentation |
|------------|-------|-----------------|
| 1-5 | PostgreSQL problems | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| 6-11 | Python/venv problems | [STEP_BY_STEP.md](STEP_BY_STEP.md) |
| 12-14 | .env configuration | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| 15-17 | Server won't start | [SETUP_GUIDE.md](SETUP_GUIDE.md) Troubleshooting |
| 18-20 | Health check fails | Check database is running |
| 21-27 | Swagger UI issues | [SWAGGER_UI_GUIDE.md](SWAGGER_UI_GUIDE.md) |
| 28-29 | Database issues | [SETUP_GUIDE.md](SETUP_GUIDE.md) |

---

## 📞 Common Questions

**Q: My virtual environment won't activate**
A: See [STEP_BY_STEP.md](STEP_BY_STEP.md) Phase 2, Step 8

**Q: "Port 8000 already in use"**
A: See [SETUP_GUIDE.md](SETUP_GUIDE.md) Troubleshooting

**Q: "Could not connect to database"**
A: See [SETUP_GUIDE.md](SETUP_GUIDE.md) Troubleshooting

**Q: Swagger UI shows no endpoints**
A: Hard refresh browser (Ctrl+Shift+R)

**Q: I want to understand how everything works**
A: Read [ARCHITECTURE.md](ARCHITECTURE.md)

**Q: How do I test endpoints?**
A: See [SWAGGER_UI_GUIDE.md](SWAGGER_UI_GUIDE.md)

---

## 🎓 Next Steps After Verification

Once ALL items are checked:

1. **Rest and celebrate!** ✓ You have a working API
2. **Review code** - Read through the main.py and understand structure
3. **Read ARCHITECTURE.md** - Understand system design
4. **Explore Swagger UI** - Test more endpoints
5. **Next feature** - Ask to implement JWT authentication

---

## 📝 Notes

**Date Completed:** _______________

**Issues Encountered:** 
(None - ___________)

**Time Taken:** _______________

**Confidence Level:** 🟢 🟡 🔴 (circle one)

---

## 🏁 Congratulations!

If all checkboxes above are checked, your AI-Powered News Digest API is:
- ✓ Successfully installed
- ✓ Properly configured
- ✓ Running and responding
- ✓ Connected to database
- ✓ Ready for development

**You're now ready to add new features!**

Next: JWT authentication, then topics management, then summarization...

---

**Questions? Review the relevant documentation or let me know!**
