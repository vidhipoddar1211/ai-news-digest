# Architecture & Database Explanation

## How Everything Works Together

### Layered Architecture Diagram

```
┌─────────────────────────────────────────┐
│         HTTP Request (Swagger/Browser)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     FastAPI Routes Layer (main.py)      │
│  - Receives HTTP requests                │
│  - Validates input with Pydantic         │
│  - Routes to appropriate handlers        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Routes/Handlers (routes/auth.py)     │
│  - @app.post("/api/auth/register")      │
│  - @app.get("/api/auth/users/{id}")     │
│  - Calls service layer                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Services Layer (services/user_...)    │
│  - Business logic                        │
│  - Database operations                   │
│  - Password hashing                      │
│  - User validation                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Models Layer (models/user.py)        │
│  - SQLAlchemy ORM models                 │
│  - Defines database table schema         │
│  - Column definitions                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Database Layer (database.py)           │
│  - SQLAlchemy engine                     │
│  - Session management                    │
│  - Connection pooling                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       PostgreSQL Database               │
│  - Stores actual data                    │
│  - users table                           │
│  - Other future tables                   │
└─────────────────────────────────────────┘
```

## File Dependencies & Imports

```
main.py
├── imports: config.py (settings)
├── imports: database.py (engine, Base, get_db)
├── imports: models/__init__.py (User)
├── imports: routes/__init__.py (auth_router)
│   └── routes/auth.py
│       ├── imports: database.py (get_db)
│       ├── imports: schemas/user.py (UserCreate, UserRead)
│       └── imports: services/user_service.py (UserService)
│           └── services/user_service.py
│               ├── imports: models/user.py (User)
│               ├── imports: schemas/user.py (UserCreate, UserUpdate)
│               └── imports: utils/security.py (hash_password, verify_password)

config.py
└── imports: pydantic_settings

database.py
└── imports: config.py (settings)

models/user.py
└── imports: database.py (Base)

utils/security.py
└── imports: passlib (password hashing)
```

## Request Flow Example

### User Registration Request

```
User submits form in Swagger UI:
{
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
        ↓
FastAPI receives POST /api/auth/register
        ↓
Pydantic validates request body → UserCreate schema
        ↓
Routes handler receives validated UserCreate
        ↓
Calls UserService.create_user(db, user_create)
        ↓
UserService:
  1. Hash password using bcrypt
  2. Create User ORM object
  3. Add to session
  4. Commit to database
  5. Return User object
        ↓
Route handler returns User object
        ↓
Pydantic serializes to UserRead schema
        ↓
Response sent back to client (without password):
{
  "id": 1,
  "email": "john@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2026-01-29T10:30:00",
  "updated_at": "2026-01-29T10:30:00"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### How SQLAlchemy Creates This

**ORM Model (user.py):**
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    # ... more columns
```

**When app starts (main.py):**
```python
Base.metadata.create_all(bind=engine)
```
- Checks if tables exist
- Creates missing tables automatically
- Updates schema if needed

## Data Validation Layers

### Layer 1: Pydantic Schemas (Input)
```
POST /api/auth/register
{
  "email": "not-valid-email",  ← Invalid format
  "password": "short"           ← Less than 8 characters
}
        ↓
Pydantic validation fails
        ↓
Returns 422 Validation Error with details
```

### Layer 2: Business Logic (Services)
```
UserService.create_user():
  1. Check if email already exists
  2. Verify password strength (optional)
  3. Hash password securely
  4. Create database record
```

### Layer 3: Database Constraints
```
INSERT INTO users (email, ...)
    ↓
Database checks:
  - email is UNIQUE
  - email is NOT NULL
  - If duplicate → Database error → Caught in try/except
```

## Configuration Management

### config.py Flow
```
.env file
  ↓
pydantic_settings reads .env
  ↓
Settings() object created
  ↓
All modules import: from app.config import settings
  ↓
Access values: settings.DATABASE_URL, settings.DEBUG, etc.
```

### Environment Variables Used
```
DATABASE_URL        → SQLAlchemy connection string
SECRET_KEY         → JWT signing (future feature)
DEBUG              → Logging and error details
SMTP_SERVER        → Email configuration (future feature)
OPENAI_API_KEY     → AI summarization (future feature)
```

## Security Considerations

### Password Hashing
```
User submits: "password123"
        ↓
hash_password() uses bcrypt
        ↓
Stored in DB: "$2b$12$R9h...encrypted..." (cannot be reversed)
        ↓
When logging in:
  - User submits: "password123"
  - Bcrypt verifies against stored hash
  - Returns True/False (never decrypts)
```

### Why Not Store Plain Passwords?
- If database is compromised, passwords are safe
- Bcrypt is one-way encryption
- Industry standard practice

## Future Models Relationship

```
Users (1) ──→ (Many) UserTopics
    ↓
Users (1) ──→ (Many) UserURLs
    ↓
Users (1) ──→ (Many) DigestSchedules
    ↓
Users (1) ──→ (Many) DeliveryHistory
```

Where:
- **UserTopics** - Topics user follows
- **UserURLs** - Custom URLs to fetch from
- **DigestSchedules** - When to send digests
- **DeliveryHistory** - Sent digests and summaries

## Testing Each Layer

### Test 1: Database Layer
```powershell
# Verify connection
python -c "from app.database import engine; engine.execute('SELECT 1')"
```

### Test 2: Models Layer
```powershell
# Check if tables exist
python -c "from app.database import Base, engine; Base.metadata.create_all(engine)"
```

### Test 3: Schemas Layer
```powershell
# Test validation
python -c "
from app.schemas.user import UserCreate
try:
    UserCreate(email='test@example.com', password='short')
except Exception as e:
    print(f'Validation error: {e}')
"
```

### Test 4: Services Layer
```powershell
# Test password hashing
python -c "
from app.utils.security import hash_password, verify_password
hashed = hash_password('mypassword')
print(f'Password correct: {verify_password(\"mypassword\", hashed)}')
"
```

### Test 5: API Layer
```powershell
# Test via HTTP
curl http://localhost:8000/health
```

## Connection String Explained

```
postgresql://news_user:secure_password_123@localhost:5432/news_digest
│           │ │                      │ │        │    │              │
│           │ │                      │ │        │    │              └─ Database name
│           │ │                      │ │        │    └─ Port number
│           │ │                      │ │        └─ Host (localhost = this machine)
│           │ │                      │ └─ Password
│           │ └─ Username
│           └─ Separator
└─ Database type (PostgreSQL)
```

## Performance Features

### 1. Connection Pooling (database.py)
```python
engine = create_engine(..., pool_pre_ping=True)
```
- Reuses connections
- Tests connections before using
- Better than creating new connection per request

### 2. Indexes (user.py)
```python
email = Column(String(255), unique=True, index=True)
```
- Speeds up email lookups
- Enforces uniqueness

### 3. Automatic Timestamps
```python
created_at = Column(DateTime, server_default=func.now())
```
- Database handles timestamps
- Consistent across all records

## Summary

1. **Layered Architecture** - Each layer has single responsibility
2. **Clear Separation** - Routes → Services → Models → Database
3. **Type Safety** - Pydantic validates all inputs
4. **Security** - Passwords hashed, no plaintext storage
5. **Scalability** - Easy to add new features without touching existing code
6. **Testing** - Each layer can be tested independently
