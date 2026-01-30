# Swagger UI - Complete Guide

## What is Swagger UI?

Swagger UI is an interactive tool that:
- Shows all API endpoints
- Lets you test endpoints directly from browser
- Displays request/response schemas
- No command line or special tools needed
- Automatically generated from FastAPI code

## Accessing Swagger UI

### Start the server:
```powershell
python -m uvicorn app.main:app --reload
```

### Open in browser:
```
http://localhost:8000/docs
```

You should see a page with:
- "News Digest API" title
- List of endpoints
- Green/Blue/Yellow buttons
- "Try it out" buttons

---

## Understanding the Interface

### Top Section
```
┌─────────────────────────────────────────┐
│  Swagger UI                             │
│  News Digest API                        │
│  AI-Powered Personalized News Digest API│
│  Version: 0.1.0                         │
│  [BASE URL: http://localhost:8000]      │
└─────────────────────────────────────────┘
```

### Endpoints Grouped by Tags
```
┌─ health (Expand/Collapse)
│  GET  /          Root endpoint
│  GET  /health    Detailed health check
│
└─ auth (Expand/Collapse)
   POST /api/auth/register        Create user
   GET  /api/auth/users/{user_id} Get user
```

---

## Color Coding

- **Green** = GET (Read data)
- **Blue** = POST (Create/Submit data)
- **Yellow** = PUT (Update data)
- **Red** = DELETE (Remove data)

---

## Testing an Endpoint Step-by-Step

### Example 1: Test Health Check (GET Request)

1. **Find the endpoint**
   - Look for "health" section
   - Find `GET /health`

2. **Expand the endpoint**
   - Click on the endpoint
   - Details expand below

3. **View request information**
   - No parameters needed
   - No request body needed

4. **Click "Try it out"**
   - Button appears in top right of endpoint
   - Interface becomes interactive

5. **Execute the request**
   - "Execute" button appears
   - Click it
   - Server processes request

6. **View response**
   ```
   Response Code: 200
   Response Headers:
     content-type: application/json
   Response Body:
     {
       "status": "healthy",
       "database": "connected",
       "app_name": "News Digest API"
     }
   ```

---

## Testing an Endpoint with Request Body

### Example 2: Register New User (POST Request)

1. **Find the endpoint**
   - Look for "auth" section
   - Find `POST /api/auth/register` (blue button)

2. **Click to expand**
   - Details show below

3. **Review schema**
   - Shows required fields:
     - email (string)
     - password (string, min 8 chars)
     - full_name (string, optional)

4. **Click "Try it out"**
   - Request body editor appears
   - Shows example JSON

5. **Enter test data**
   - Replace example with your data:
   ```json
   {
     "email": "john@example.com",
     "password": "securepass123",
     "full_name": "John Doe"
   }
   ```

6. **Click "Execute"**
   - Request sent to server

7. **View response**
   ```
   Response Code: 201
   Response Headers:
     content-type: application/json
   Response Body:
     {
       "id": 1,
       "email": "john@example.com",
       "full_name": "John Doe",
       "is_active": true,
       "created_at": "2026-01-29T10:30:00.000000",
       "updated_at": "2026-01-29T10:30:00.000000"
     }
   ```

---

## Testing with Path Parameters

### Example 3: Get User by ID (GET with parameter)

1. **Find endpoint**
   - `GET /api/auth/users/{user_id}`

2. **Expand endpoint**

3. **View parameter section**
   - Shows `user_id` parameter
   - Type: integer
   - Required: yes
   - Location: path

4. **Click "Try it out"**
   - Parameter input field appears

5. **Enter parameter value**
   - In the text box labeled "user_id", enter: `1`

6. **Click "Execute"**

7. **View response**
   ```json
   {
     "id": 1,
     "email": "john@example.com",
     "full_name": "John Doe",
     "is_active": true,
     "created_at": "2026-01-29T10:30:00.000000",
     "updated_at": "2026-01-29T10:30:00.000000"
   }
   ```

---

## Understanding Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request successful | Getting user data |
| 201 | Created - Resource created | User registration |
| 400 | Bad Request - Invalid data | Wrong email format |
| 404 | Not Found - Resource doesn't exist | User ID 999 |
| 422 | Validation Error - Invalid schema | Missing required field |
| 500 | Server Error | Database connection failed |

---

## Viewing Request Details

After clicking "Execute", you can see:

### Request
```
Request URL: http://localhost:8000/api/auth/register
Request Method: POST
Request Headers:
  - Content-Type: application/json
Request Body:
  {
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }
```

### Response
```
Response Status: 201
Response Headers:
  - content-length: 250
  - content-type: application/json
Response Body:
  (JSON data returned)
```

---

## Using Response Data

When you get a response like:
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

You can use the `id` (which is `1`) to test other endpoints that need user_id.

---

## Complete Testing Workflow

### Step 1: Start with Health Check
```
GET /health → Should return 200 OK
```

### Step 2: Register First User
```
POST /api/auth/register
Body: {
  "email": "user1@example.com",
  "password": "password123",
  "full_name": "User One"
}
Response: User with id: 1
```

### Step 3: Retrieve That User
```
GET /api/auth/users/1
Response: User one's data
```

### Step 4: Register Second User
```
POST /api/auth/register
Body: {
  "email": "user2@example.com",
  "password": "password123",
  "full_name": "User Two"
}
Response: User with id: 2
```

### Step 5: Retrieve Second User
```
GET /api/auth/users/2
Response: User two's data
```

### Step 6: Try Invalid User ID
```
GET /api/auth/users/999
Response: 404 Not Found - "User not found"
```

### Step 7: Try Duplicate Email
```
POST /api/auth/register
Body: {
  "email": "user1@example.com",  ← Same as Step 2
  "password": "password123",
  "full_name": "Another User"
}
Response: 400 Bad Request - "Email already exists"
```

---

## Advanced Features

### Expand/Collapse All
```
Click the button with arrows at top to:
- Expand all endpoints at once
- Collapse all endpoints at once
```

### Filter Endpoints
```
Search box at top lets you:
- Filter by endpoint name
- Type "register" to see only registration endpoints
- Type "user" to see user-related endpoints
```

### Copy Request Information
```
After Execute:
- Copy curl command (useful for debugging)
- Copy response data
- View raw request/response
```

### URL Parameters
```
Click BASE URL dropdown to:
- See current server URL
- Change to different server (if you have multiple)
```

---

## View Schemas

At the bottom of Swagger UI:

### Schemas Section
Shows data structure for each model:

```
UserCreate:
  email: string (email)
  password: string (minLength: 8)
  full_name: string (optional)

UserRead:
  id: integer
  email: string
  full_name: string
  is_active: boolean
  created_at: date-time
  updated_at: date-time
```

---

## Common Testing Scenarios

### Scenario 1: Verify Database Connection
```
Action: GET /health
Expected: status: "healthy", database: "connected"
Success: ✓ Database is connected
Failure: ✗ Check if PostgreSQL is running
```

### Scenario 2: Create and Retrieve User
```
1. POST /api/auth/register
2. Note the returned user id
3. GET /api/auth/users/{id}
4. Verify returned data matches what was sent
Success: ✓ User creation and retrieval working
```

### Scenario 3: Validate Email Format
```
POST /api/auth/register
Body: {
  "email": "invalid-email",  ← Not a valid email
  "password": "password123",
  "full_name": "Test"
}
Expected: 422 Validation Error
Success: ✓ Email validation working
```

### Scenario 4: Test Password Requirements
```
POST /api/auth/register
Body: {
  "email": "test@example.com",
  "password": "short",  ← Less than 8 characters
  "full_name": "Test"
}
Expected: 422 Validation Error (password too short)
Success: ✓ Password validation working
```

---

## Troubleshooting Swagger UI

### Issue: Cannot access Swagger UI (404 error)
**Solution:**
- Check if server is running
- Verify URL is: http://localhost:8000/docs (not /swagger or /api/docs)
- Server should show: "Application startup complete"

### Issue: Endpoints not showing
**Solution:**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Restart server

### Issue: Request fails with "ERR_NETWORK"
**Solution:**
- Check if server is running
- Check server console for errors
- Verify database is running

### Issue: Always getting 422 Validation Error
**Solution:**
- Check request body format (must be valid JSON)
- Check required fields are included
- Check data types match schema

### Issue: "CORS" error
**Solution:**
- This is already configured in main.py
- If you still get it, check CORS settings
- Usually means frontend can't talk to backend

---

## Alternative Documentation View

If Swagger UI is hard to read, try ReDoc:
```
http://localhost:8000/redoc
```

ReDoc shows the same information in a different layout:
- Better for reading documentation
- Not interactive like Swagger
- Good for understanding API structure

---

## Real-World Example Requests

### Register Alice
```
POST /api/auth/register
{
  "email": "alice@company.com",
  "password": "AliceSecure2026!",
  "full_name": "Alice Johnson"
}
→ Response: id: 1
```

### Register Bob
```
POST /api/auth/register
{
  "email": "bob@company.com",
  "password": "BobSecure2026!",
  "full_name": "Bob Smith"
}
→ Response: id: 2
```

### Get Alice's Profile
```
GET /api/auth/users/1
→ Returns Alice's full profile
```

### Get Bob's Profile
```
GET /api/auth/users/2
→ Returns Bob's full profile
```

### Try to get non-existent user
```
GET /api/auth/users/100
→ 404 Not Found (user doesn't exist)
```

---

## Pro Tips

1. **Use realistic test data** - Email should be unique each time
2. **Save response data** - Copy user IDs for testing dependent endpoints
3. **Test error cases** - Try invalid data to verify validation
4. **Check response codes** - Don't just look at response body
5. **Review headers** - Understand Content-Type and other metadata
6. **Clear browser cache** - If you see old responses
7. **Check server logs** - Terminal shows detailed request information

---

## Next Steps

Once you've tested all endpoints successfully:
1. Understand the layered architecture (see ARCHITECTURE.md)
2. Review the code to see how requests flow through layers
3. Prepare for JWT authentication implementation
4. Think about what additional features you need

---

**Swagger UI is your friend! Use it to understand how the API works before writing any frontend code.**
