# Visual Architecture Guide

Visual diagrams showing how the system works.

---

## System Architecture Overview

### High-Level View

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                   Running on port 3000                       │
└──────────────────┬───────────────────────────────────────────┘
                   │ HTTP Requests
                   ↓
┌──────────────────────────────────────────────────────────────┐
│                    FASTAPI SERVER                            │
│              Running on port 8000                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Route Layer (routes/auth.py)               │     │
│  │  POST   /api/auth/register                         │     │
│  │  POST   /api/auth/login       (to be added)        │     │
│  │  GET    /api/auth/users/{id}                       │     │
│  │  GET    /health                                    │     │
│  └───────────┬────────────────────────────────────────┘     │
│              │ Calls                                         │
│              ↓                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │     Service Layer (services/user_service.py)       │     │
│  │  • create_user()                                   │     │
│  │  • authenticate_user()                             │     │
│  │  • get_user_by_id()                                │     │
│  │  • update_user()                                   │     │
│  └───────────┬────────────────────────────────────────┘     │
│              │ Uses ORM                                      │
│              ↓                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │      Models Layer (models/user.py)                 │     │
│  │  SQLAlchemy ORM Models                             │     │
│  │  Defines: User, Topic, URL, etc.                   │     │
│  └───────────┬────────────────────────────────────────┘     │
│              │ Translates to SQL                             │
│              ↓                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Database Layer (database.py)                      │     │
│  │  • SQLAlchemy engine                               │     │
│  │  • Connection pooling                              │     │
│  │  • Session management                              │     │
│  └───────────┬────────────────────────────────────────┘     │
└──────────────┼────────────────────────────────────────────────┘
               │ SQL Queries
               ↓
┌──────────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE                         │
│               Running on port 5432                           │
│                                                              │
│  ┌─────────────────────────────────────────────────┐        │
│  │ Database: news_digest                           │        │
│  │                                                 │        │
│  │  Tables:                                        │        │
│  │  • users              (current)                 │        │
│  │  • topics             (to be added)             │        │
│  │  • user_urls          (to be added)             │        │
│  │  • digest_schedules   (to be added)             │        │
│  │  • delivery_history   (to be added)             │        │
│  └─────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────┘
```

---

## Request Processing Flow

### Complete Lifecycle of a Registration Request

```
BROWSER / SWAGGER UI
    │
    │ User clicks "Try it out" on POST /api/auth/register
    │ Submits form: {email, password, full_name}
    │
    ↓
FASTAPI SERVER
    │
    ├─→ Receives HTTP POST request
    │
    ├─→ Middleware processes (CORS, etc.)
    │
    ├─→ Routes layer (auth.py)
    │   @app.post("/api/auth/register")
    │   - Gets request body
    │
    ├─→ Pydantic Validation (schemas/user.py)
    │   - Validates email format
    │   - Checks password length ≥ 8
    │   - Converts to UserCreate object
    │   - If invalid: Return 422 error
    │
    ├─→ Route handler calls
    │   UserService.create_user(db, user_create)
    │
    ├─→ Service Layer (user_service.py)
    │   - Hashes password with bcrypt
    │   - Creates User ORM object
    │   - Calls db.add() and db.commit()
    │
    ├─→ Models Layer (user.py)
    │   - SQLAlchemy translates to SQL
    │   - Validates database constraints
    │   - Generates INSERT statement
    │
    ├─→ Database Layer (database.py)
    │   - Connection pooling
    │   - Session management
    │   - Sends SQL to PostgreSQL
    │
    ↓
POSTGRESQL DATABASE
    │
    ├─→ Receives INSERT statement
    │   INSERT INTO users (email, hashed_password, full_name, ...)
    │   VALUES ('user@example.com', '$2b$12$...', 'John Doe', ...)
    │
    ├─→ Database constraints check
    │   - Email unique? ✓
    │   - All required fields present? ✓
    │   - Column types correct? ✓
    │
    ├─→ If validation passed:
    │   - Generate id: 1
    │   - Set created_at: 2026-01-29 10:30:00
    │   - Insert row
    │   - Return new row
    │
    ├─→ If validation failed:
    │   - Raise constraint error
    │   - Service catches with try/except
    │   - Return HTTP 400 error
    │
    ↓
BACK TO FASTAPI
    │
    ├─→ Service returns User object
    │
    ├─→ Route handler receives User
    │
    ├─→ Pydantic serialization (UserRead schema)
    │   - Converts ORM object to JSON
    │   - Includes: id, email, full_name, is_active, timestamps
    │   - Excludes: hashed_password (IMPORTANT!)
    │
    ├─→ FastAPI creates HTTP response
    │   Status: 201 Created
    │   Headers: Content-Type: application/json
    │   Body: JSON user data
    │
    ↓
BACK TO BROWSER / SWAGGER UI
    │
    └─→ Displays response:
        {
          "id": 1,
          "email": "user@example.com",
          "full_name": "John Doe",
          "is_active": true,
          "created_at": "2026-01-29T10:30:00",
          "updated_at": "2026-01-29T10:30:00"
        }
```

---

## Data Validation Pipeline

### Multi-Layer Validation

```
Input Data
    │
    ├─→ LAYER 1: HTTP Request Parsing
    │   ├─ Is it valid JSON?
    │   ├─ Can it be deserialized?
    │   └─ If fail: Return 400 Bad Request
    │
    ├─→ LAYER 2: Pydantic Schema Validation
    │   ├─ Required fields present?
    │   ├─ Email format valid? (EmailStr)
    │   ├─ Password min 8 chars?
    │   ├─ Data types correct?
    │   └─ If fail: Return 422 Validation Error
    │
    ├─→ LAYER 3: Business Logic Validation
    │   ├─ Email already exists? (query DB)
    │   ├─ Password strong enough? (optional)
    │   ├─ Other business rules?
    │   └─ If fail: Return 400 Bad Request
    │
    ├─→ LAYER 4: Database Constraints
    │   ├─ Email UNIQUE constraint
    │   ├─ NOT NULL constraints
    │   ├─ Column type validation
    │   └─ If fail: Database error caught
    │
    └─→ LAYER 5: Database Triggers (future)
        └─ Any additional business logic in DB
```

---

## File Dependency Graph

### Import Relationships

```
main.py
├── imports config.py
│   └── imports BaseSettings (pydantic)
├── imports database.py
│   ├── imports engine, Base
│   └── imports config.py
├── imports models/__init__.py
│   └── imports models/user.py
│       └── imports Base (from database.py)
├── imports routes/__init__.py
│   └── imports routes/auth.py
│       ├── imports database.py (for get_db)
│       ├── imports schemas/user.py
│       │   └── imports BaseModel (pydantic)
│       └── imports services/user_service.py
│
services/user_service.py
├── imports models/user.py
├── imports schemas/user.py
├── imports utils/security.py
│   └── imports passlib (for bcrypt)
└── imports SQLAlchemy

utils/security.py
└── imports passlib.context
```

---

## Database Schema Diagram

### Current Tables (Users)

```
┌─────────────────────────────────────┐
│          users TABLE                │
├─────────────────────────────────────┤
│ Column          │ Type              │
├─────────────────┼───────────────────┤
│ id              │ INTEGER (PK)      │
│ email           │ VARCHAR(255)      │
│                 │ UNIQUE, INDEXED   │
│ hashed_password │ VARCHAR(255)      │
│ full_name       │ VARCHAR(255)      │
│ is_active       │ BOOLEAN (T)       │
│ created_at      │ TIMESTAMP         │
│                 │ DEFAULT NOW()     │
│ updated_at      │ TIMESTAMP         │
│                 │ DEFAULT NOW()     │
└─────────────────────────────────────┘

Indices:
  - PK on id
  - UNIQUE on email
  - INDEX on email (for lookups)

Constraints:
  - email: NOT NULL, UNIQUE
  - hashed_password: NOT NULL
  - created_at/updated_at: server-default
```

### Future Tables (To Be Added)

```
┌──────────────────────────────────────────┐
│         topics TABLE                     │
├──────────────────────────────────────────┤
│ Column        │ Type                     │
├───────────────┼──────────────────────────┤
│ id            │ INTEGER (PK)             │
│ user_id       │ INTEGER (FK → users.id)  │
│ topic_name    │ VARCHAR(255)             │
│ keywords      │ TEXT                     │
│ is_active     │ BOOLEAN                  │
│ created_at    │ TIMESTAMP                │
│ updated_at    │ TIMESTAMP                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│         user_urls TABLE                  │
├──────────────────────────────────────────┤
│ Column        │ Type                     │
├───────────────┼──────────────────────────┤
│ id            │ INTEGER (PK)             │
│ user_id       │ INTEGER (FK → users.id)  │
│ url           │ VARCHAR(500)             │
│ description   │ TEXT                     │
│ is_active     │ BOOLEAN                  │
│ created_at    │ TIMESTAMP                │
│ updated_at    │ TIMESTAMP                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│    digest_schedules TABLE                │
├──────────────────────────────────────────┤
│ Column            │ Type                 │
├───────────────────┼──────────────────────┤
│ id                │ INTEGER (PK)         │
│ user_id           │ INTEGER (FK)         │
│ schedule_time     │ TIME                 │
│ frequency         │ VARCHAR (daily)      │
│ summary_points    │ INTEGER (1, 5, 10+)  │
│ is_active         │ BOOLEAN              │
│ created_at        │ TIMESTAMP            │
│ updated_at        │ TIMESTAMP            │
└──────────────────────────────────────────┘

Relationships:
  users (1) ──→ (Many) topics
  users (1) ──→ (Many) user_urls
  users (1) ──→ (Many) digest_schedules
```

---

## Configuration Flow

### How Settings Load

```
PROJECT START
    │
    ├─→ Python imports main.py
    │
    ├─→ main.py imports config.py
    │
    ├─→ config.py:
    │   ├─ from pydantic_settings import BaseSettings
    │   ├─ class Settings(BaseSettings):
    │   │   class Config:
    │   │     env_file = ".env"
    │   └─ settings = Settings()
    │
    ├─→ Python loads .env file
    │   DATABASE_URL=postgresql://...
    │   SECRET_KEY=dev-secret-key...
    │   etc.
    │
    ├─→ Pydantic validates settings
    │   ├─ All required fields present?
    │   ├─ Correct types?
    │   ├─ Valid values?
    │   └─ If fail: Raise validation error
    │
    └─→ settings object created
        Ready to use: settings.DATABASE_URL
                      settings.SECRET_KEY
                      settings.DEBUG
                      etc.

THROUGHOUT APP
    │
    └─→ All modules import:
        from app.config import settings
        
        Can access: settings.DATABASE_URL
                    settings.OPENAI_API_KEY
                    settings.DEBUG
                    etc.
```

---

## Error Handling Flow

### Validation Error Path

```
USER SUBMITS INVALID DATA
    │
    ├─→ POST /api/auth/register
    │   Body: {
    │     "email": "not-valid-email",  ← Invalid format
    │     "password": "short"           ← Too short
    │   }
    │
    ├─→ FastAPI receives request
    │
    ├─→ Pydantic validates (UserCreate schema)
    │
    ├─→ Email validation fails
    │   └─ email must be valid email format
    │
    ├─→ Password validation fails
    │   └─ ensure this value has at least 8 characters
    │
    ├─→ Pydantic raises ValidationError
    │
    ├─→ FastAPI catches error
    │
    ├─→ Generates HTTP response:
    │   Status: 422 Unprocessable Entity
    │   Body: {
    │     "detail": [
    │       {
    │         "loc": ["body", "email"],
    │         "msg": "invalid email format",
    │         "type": "value_error.email"
    │       },
    │       {
    │         "loc": ["body", "password"],
    │         "msg": "ensure this value has at least 8 characters",
    │         "type": "value_error.string.too_short"
    │       }
    │     ]
    │   }
    │
    └─→ Client receives detailed error info
        ✓ Which fields are wrong
        ✓ What the errors are
        ✓ Can fix and retry
```

### Database Error Path

```
USER TRIES TO REGISTER DUPLICATE EMAIL
    │
    ├─→ POST /api/auth/register
    │   Body: {
    │     "email": "existing@example.com",  ← Already in DB
    │     "password": "password123",
    │     "full_name": "Duplicate User"
    │   }
    │
    ├─→ Pydantic validation passes ✓
    │
    ├─→ Route calls UserService.create_user()
    │
    ├─→ Service tries:
    │   db.add(user)
    │   db.commit()
    │
    ├─→ SQLAlchemy translates to:
    │   INSERT INTO users (email, ...) VALUES ('existing@example.com', ...)
    │
    ├─→ PostgreSQL receives INSERT
    │
    ├─→ Database checks UNIQUE constraint on email
    │
    ├─→ Constraint violation! Error raised
    │   ERROR: duplicate key value violates unique constraint
    │
    ├─→ SQLAlchemy raises IntegrityError
    │
    ├─→ Service catches with try/except:
    │   except IntegrityError:
    │       db.rollback()
    │       raise ValueError("Email ... already exists")
    │
    ├─→ Route catches ValueError
    │
    ├─→ Returns HTTPException:
    │   Status: 400 Bad Request
    │   Detail: "Email existing@example.com already exists"
    │
    └─→ Client gets clear error message
        ✓ Knows what went wrong
        ✓ Can use different email
```

---

## Request Timing Diagram

### What Happens When You Submit a Request

```
Time →

Browser/Swagger UI
  │
  └─→ [Click Execute]
       ↓ 1ms - Send HTTP request
       ↓
FastAPI Server
       │
       ├─→ [1-2ms] Receive request
       ├─→ [1-2ms] Parse JSON
       ├─→ [2-3ms] Pydantic validation
       ├─→ [1ms] Route dispatch
       ├─→ [1ms] Dependency injection (get_db)
       │
       └─→ [1ms] Call UserService.create_user()
           │
           ├─→ [1ms] Hash password (bcrypt)
           ├─→ [1ms] Create ORM object
           ├─→ [1ms] db.add()
           │
           └─→ [10-50ms] db.commit() ← SLOWEST PART
               │
               └─→ PostgreSQL
                   │
                   ├─→ [1ms] Parse SQL
                   ├─→ [1ms] Check constraints
                   ├─→ [5-30ms] Write to disk
                   ├─→ [1ms] Return result
                   │
                   └─→ [1ms] Send back to FastAPI
       │
       ├─→ [1ms] db.refresh() - Get updated object
       ├─→ [1ms] Pydantic serialization (UserRead)
       ├─→ [1ms] Create HTTP response
       │
       └─→ [1-2ms] Send response
            ↓
Browser/Swagger UI
  └─→ [Display response]

TOTAL TIME: 30-100ms typically
           (depends on database speed)
```

---

## State Transitions

### User Account Lifecycle

```
NOT REGISTERED
    │
    └─→ POST /api/auth/register
        │ Input: email, password, full_name
        │
        ├─→ Validate format ✓
        ├─→ Hash password ✓
        ├─→ Check email unique ✓
        ├─→ Create in database ✓
        │
        └─→ REGISTERED STATE
            ├─ is_active = true
            ├─ id = 1
            ├─ created_at = 2026-01-29 10:30:00
            │
            └─→ Can now:
                ├─ Login (future)
                ├─ Update profile
                └─ Access protected endpoints (future)
            │
            └─→ Can also:
                ├─ GET /api/auth/users/{id}
                │ Returns: full user data
                │
                └─→ [IN FUTURE]
                    ├─ GET /api/topics (manage topics)
                    ├─ GET /api/urls (manage URLs)
                    └─ GET /api/digests (view sent digests)
```

---

## Security Flow

### Password Security Journey

```
USER ENTERS PASSWORD: "MySecurePassword123"
    │
    ├─→ Browser sends HTTPS ✓ (encrypted in transit)
    │
    ├─→ FastAPI receives
    │
    ├─→ Service calls: hash_password(password)
    │
    ├─→ Bcrypt algorithm:
    │   ├─ Generate random salt
    │   ├─ Hash password with salt 12 rounds
    │   ├─ Result: "$2b$12$R9h/cIPz0gi.URNNGHQ3dOYeajVmAzl0nXvfScf6wA..."
    │   └─ IRREVERSIBLE - cannot get password back
    │
    ├─→ Store in database: hashed_password = "$2b$12$R9h/..."
    │   ✓ Plain password never stored
    │   ✓ Database leak doesn't expose passwords
    │
    ├─→ When user logs in (future):
    │   Input password: "MySecurePassword123"
    │       │
    │       └─→ verify_password(password, hashed_password)
    │           ├─ Take input password
    │           ├─ Hash with same salt
    │           ├─ Compare hashes
    │           ├─ Return True/False
    │           └─ Original password NEVER used
    │
    └─→ Authentication successful without ever handling plain password
```

---

## Summary

### The Big Picture

```
1. USER INTERACTS
   └─→ Opens Swagger UI, submits form

2. HTTP REQUEST
   └─→ Browser sends JSON to FastAPI

3. VALIDATION
   └─→ Pydantic validates data format

4. BUSINESS LOGIC
   └─→ Service processes (hash password, etc.)

5. DATABASE OPERATION
   └─→ ORM translates to SQL, PostgreSQL executes

6. RESPONSE
   └─→ Serialized data sent back as JSON

7. DISPLAY
   └─→ Browser shows response to user
```

---

This visual guide helps understand system flow at a glance. Refer to [ARCHITECTURE.md](ARCHITECTURE.md) for detailed text explanations.
