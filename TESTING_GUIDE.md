# API Endpoint Testing Guide

## Overview

This guide explains how to test all API endpoints using different methods.

## Method 1: Swagger UI (Interactive - Recommended)

**What is Swagger UI?**
- Interactive API documentation
- Test endpoints directly from your browser
- See request/response schemas
- No command line needed

### Steps:

1. **Start the FastAPI server**
   ```powershell
   cd c:\Users\vidhi\Desktop\News\backend
   python -m uvicorn app.main:app --reload
   ```

2. **Open in browser**
   ```
   http://localhost:8000/docs
   ```

3. **You'll see:**
   - All available endpoints listed
   - Green = GET, Blue = POST, Yellow = PUT, Red = DELETE
   - Click any endpoint to expand it
   - Click "Try it out" button to test

### Testing Endpoints in Swagger:

#### Test 1: Health Check
- Find endpoint: `GET /`
- Click "Try it out" → Execute
- Expected response: 
  ```json
  {
    "message": "AI-Powered Personalized News Digest API",
    "status": "running",
    "version": "0.1.0"
  }
  ```

#### Test 2: Detailed Health Check
- Find endpoint: `GET /health`
- Click "Try it out" → Execute
- Expected response:
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "app_name": "News Digest API"
  }
  ```

#### Test 3: Register New User
- Find endpoint: `POST /api/auth/register`
- Click "Try it out"
- Fill in the request body with:
  ```json
  {
    "email": "john@example.com",
    "password": "securepass123",
    "full_name": "John Doe"
  }
  ```
- Click "Execute"
- Expected response (201 Created):
  ```json
  {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2026-01-29T10:30:00",
    "updated_at": "2026-01-29T10:30:00"
  }
  ```

#### Test 4: Get User by ID
- Find endpoint: `GET /api/auth/users/{user_id}`
- Click "Try it out"
- Enter user_id: `1` (or whatever ID was returned from registration)
- Click "Execute"
- Expected response (200 OK):
  ```json
  {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2026-01-29T10:30:00",
    "updated_at": "2026-01-29T10:30:00"
  }
  ```

## Method 2: PowerShell/cURL Commands

### Test Health Endpoint
```powershell
# Simple health check
curl http://localhost:8000/health

# Pretty print JSON response
curl http://localhost:8000/health | ConvertFrom-Json | ConvertTo-Json
```

### Register a User
```powershell
$body = @{
    email = "alice@example.com"
    password = "secure_password_123"
    full_name = "Alice Smith"
} | ConvertTo-Json

curl -X POST http://localhost:8000/api/auth/register `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Get User by ID
```powershell
curl http://localhost:8000/api/auth/users/1
```

## Method 3: Python Script

Run the included test script:

```powershell
# Make sure virtual environment is activated
python test_api.py
```

This script:
- Tests health endpoints
- Creates a test user
- Retrieves user data
- Shows formatted JSON responses

## Method 4: Visual Studio Code REST Client

**Install the extension:**
1. Open VS Code
2. Extensions → Search "REST Client"
3. Install by Huachao Mao

**Create a `.http` file:**

Create `backend/requests.http`:
```http
### Test root endpoint
GET http://localhost:8000/

### Test health endpoint
GET http://localhost:8000/health

### Register new user
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "email": "bob@example.com",
  "password": "password123",
  "full_name": "Bob Johnson"
}

### Get user by ID
GET http://localhost:8000/api/auth/users/1
```

**Usage:**
- Click "Send Request" above each request
- Responses appear in the right panel

## Understanding Responses

### Status Codes:

- **200 OK** - Request successful, data returned
- **201 Created** - Resource created successfully (POST requests)
- **400 Bad Request** - Invalid data sent
- **404 Not Found** - Resource doesn't exist
- **500 Server Error** - Server error (check terminal output)

### Response Format:

All responses include:
- **Status Code** - HTTP status (top of response)
- **Headers** - Metadata (Content-Type, etc.)
- **Body** - Actual data (JSON format)

## Testing Workflow

1. **Start Server**
   ```powershell
   python -m uvicorn app.main:app --reload
   ```

2. **Open Swagger UI**
   ```
   http://localhost:8000/docs
   ```

3. **Test Health Endpoints**
   - GET /
   - GET /health

4. **Test User Registration**
   - POST /api/auth/register
   - Create 2-3 test users with different emails

5. **Test User Retrieval**
   - GET /api/auth/users/1
   - GET /api/auth/users/2
   - Try invalid ID like /users/999 (should return 404)

## Common Issues & Fixes

### "Connection refused" error
- API not running
- Fix: Run `python -m uvicorn app.main:app --reload`

### "Pydantic validation error"
- Invalid JSON or missing required fields
- Fix: Check request body format against schema in Swagger

### "Email already exists"
- User with that email already registered
- Fix: Use different email in POST request

### "User not found" (404)
- User ID doesn't exist
- Fix: Use valid user ID from registration response

## Checking Database Directly

Verify users are being saved to database:

```powershell
# Open PostgreSQL CLI
psql -U news_user -d news_digest

# List all users
SELECT id, email, full_name, is_active FROM users;

# Exit
\q
```

## Next: JWT Authentication

Once verification is complete, the next step is:
- Add JWT token generation on login
- Add token validation on protected endpoints
- Store token in frontend localStorage
