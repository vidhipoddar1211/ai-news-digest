# Technical Reference Guide

Quick reference for developers working on the project.

---

## 🏗️ Architecture Overview

### Layered Architecture

```
HTTP Request → Routes → Services → Models → Database → PostgreSQL
                ↓         ↓          ↓        ↓
          Validation  Business   ORM      Connection
          & Routing   Logic      Objects  Pool
```

### Import Chain
```
main.py
├── config.py (settings)
├── database.py (engine, get_db)
├── models/__init__.py (User)
└── routes/__init__.py (routers)
    └── auth.py
        ├── database.py (get_db)
        ├── schemas.py (validation)
        └── services.py (logic)
            ├── models.py (ORM)
            ├── schemas.py
            └── utils/security.py
```

---

## 📁 File Locations & Purposes

### Core Application Files

| File | Purpose | Key Classes/Functions |
|------|---------|----------------------|
| `app/main.py` | FastAPI app setup | `app`, `read_root()`, `health_check()` |
| `app/config.py` | Settings management | `Settings`, `settings` |
| `app/database.py` | DB connection | `engine`, `SessionLocal`, `get_db()` |

### Models Layer

| File | Purpose | Key Classes |
|------|---------|-------------|
| `app/models/user.py` | User table schema | `User` |
| `app/models/__init__.py` | Model exports | Exports all models |

### Schemas Layer

| File | Purpose | Key Classes |
|------|---------|-------------|
| `app/schemas/user.py` | Validation schemas | `UserCreate`, `UserRead`, `UserUpdate` |

### Services Layer

| File | Purpose | Key Methods |
|------|---------|-------------|
| `app/services/user_service.py` | User logic | `create_user()`, `authenticate_user()`, `get_user_by_id()` |

### Routes Layer

| File | Purpose | Key Endpoints |
|------|---------|---------------|
| `app/routes/auth.py` | Auth endpoints | `POST /api/auth/register`, `GET /api/auth/users/{id}` |

### Utilities

| File | Purpose | Key Functions |
|------|---------|---------------|
| `app/utils/security.py` | Password handling | `hash_password()`, `verify_password()` |

---

## 🔌 API Endpoints Reference

### Current Endpoints

#### Health Checks
```
GET /
  Returns: {"message": "...", "status": "running", "version": "0.1.0"}
  Status: 200 OK

GET /health
  Returns: {"status": "healthy", "database": "connected", ...}
  Status: 200 OK
```

#### User Management
```
POST /api/auth/register
  Body: {"email": "...", "password": "...", "full_name": "..."}
  Returns: UserRead (id, email, full_name, is_active, timestamps)
  Status: 201 Created or 400/422 on error

GET /api/auth/users/{user_id}
  Returns: UserRead
  Status: 200 OK or 404 if not found
```

---

## 🗄️ Database Schema

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

### Indexes
- PRIMARY KEY on `id`
- UNIQUE on `email`
- INDEX on `email` (for faster lookups)

### Constraints
- `email` is UNIQUE (no duplicates)
- `email` is NOT NULL (required)
- `hashed_password` is NOT NULL (required)
- `is_active` defaults to TRUE

---

## 🔐 Security Implementation

### Password Hashing

```python
# Hashing (one-way encryption)
from app.utils.security import hash_password
hashed = hash_password("mypassword")  # → "$2b$12$R9h..."

# Verification (no decryption possible)
from app.utils.security import verify_password
is_correct = verify_password("mypassword", hashed)  # → True/False
```

### Key Security Points
- Uses **bcrypt** algorithm
- **One-way hashing** - password cannot be recovered
- **Automatic salt generation** - each hash is unique
- **Configurable rounds** - defaults to 12 for security/speed balance

---

## 📊 Data Flow Examples

### User Registration Flow

```
Browser HTTP Request
  ↓
FastAPI.post("/api/auth/register")
  ↓
Pydantic validates UserCreate schema
  ├─ email: valid email format?
  ├─ password: >= 8 characters?
  ├─ full_name: optional string?
  ↓ (if validation fails → return 422)
  ↓
Route handler calls UserService.create_user(db, user_create)
  ↓
Service implementation:
  1. Check if email already exists
  2. Hash password with bcrypt
  3. Create User ORM object
  4. db.add(user)
  5. db.commit()
  6. db.refresh(user)
  ↓
ORM translates to SQL INSERT statement
  ↓
PostgreSQL executes INSERT
  ↓
Database returns new User object
  ↓
Service returns User to route
  ↓
Route serializes with UserRead schema
  ↓
FastAPI returns JSON response (201 Created)
  ↓
Browser displays response
```

### Error Handling Flow

```
Invalid Input (e.g., duplicate email)
  ↓
IntegrityError raised by database
  ↓
Service catches with try/except
  ↓
Raises ValueError("Email already exists")
  ↓
Route catches ValueError
  ↓
Raises HTTPException(status_code=400, detail="...")
  ↓
FastAPI catches HTTPException
  ↓
Returns HTTP 400 response
  ↓
Browser shows error to user
```

---

## 🔧 Configuration Reference

### Environment Variables (.env)

```ini
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT (for future authentication)
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI (for future summarization)
OPENAI_API_KEY=sk-...

# Email (for future delivery)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-password
SENDER_EMAIL=your-email@gmail.com

# App Settings
DEBUG=True
APP_NAME=News Digest API
```

### Accessing Settings

```python
from app.config import settings

# Use anywhere in the app
database_url = settings.DATABASE_URL
debug_mode = settings.DEBUG
secret_key = settings.SECRET_KEY
```

---

## 🧪 Testing Reference

### Test with Swagger UI

```
1. Start server:
   python -m uvicorn app.main:app --reload

2. Open browser:
   http://localhost:8000/docs

3. Click endpoint to expand

4. Click "Try it out"

5. Enter parameters/body

6. Click "Execute"

7. View response
```

### Test with Python Script

```python
import requests

BASE_URL = "http://localhost:8000"

# Health check
response = requests.get(f"{BASE_URL}/health")
print(response.json())

# Register user
response = requests.post(
    f"{BASE_URL}/api/auth/register",
    json={
        "email": "user@example.com",
        "password": "password123",
        "full_name": "User Name"
    }
)
user_id = response.json()["id"]

# Get user
response = requests.get(f"{BASE_URL}/api/auth/users/{user_id}")
print(response.json())
```

### Test with PowerShell

```powershell
# Health check
curl http://localhost:8000/health | ConvertFrom-Json

# Register user
$body = @{
    email = "user@example.com"
    password = "password123"
    full_name = "User Name"
} | ConvertTo-Json

curl -X POST http://localhost:8000/api/auth/register `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 📈 Common Development Tasks

### Add New Model

```python
# 1. Create app/models/mymodel.py
from sqlalchemy import Column, Integer, String
from ..database import Base

class MyModel(Base):
    __tablename__ = "mymodels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))

# 2. Export in app/models/__init__.py
from .mymodel import MyModel
__all__ = ["User", "MyModel"]

# 3. Tables automatically created when app starts
# (Base.metadata.create_all(bind=engine) in main.py)
```

### Add New Endpoint

```python
# 1. Create schema in app/schemas/myschema.py
from pydantic import BaseModel

class MyCreate(BaseModel):
    name: str

class MyRead(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

# 2. Create service in app/services/my_service.py
from sqlalchemy.orm import Session
from ..models import MyModel

class MyService:
    @staticmethod
    def create(db: Session, obj: MyCreate):
        db_obj = MyModel(name=obj.name)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

# 3. Create route in app/routes/myroutes.py
from fastapi import APIRouter
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import MyCreate, MyRead
from ..services import MyService

router = APIRouter(prefix="/api/my", tags=["my"])

@router.post("/", response_model=MyRead)
def create(obj: MyCreate, db: Session = Depends(get_db)):
    return MyService.create(db, obj)

# 4. Include in app/routes/__init__.py
from .myroutes import router as my_router

# 5. Include in app/main.py
from .routes import my_router
app.include_router(my_router)
```

### Add Validation

```python
# In schemas
from pydantic import BaseModel, Field, validator

class UserCreate(BaseModel):
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=8, description="Password")
    full_name: Optional[str] = Field(None, max_length=255)
    
    @validator('password')
    def validate_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError('Password must have uppercase')
        return v
```

---

## 🐛 Debugging Tips

### Enable SQL Logging

```python
# In database.py
engine = create_engine(
    settings.DATABASE_URL,
    echo=True  # Logs all SQL statements
)
```

### Print Request Data

```python
# In route
@app.post("/api/test")
def test(request: MySchema, db: Session = Depends(get_db)):
    print(f"Request: {request.dict()}")  # Print to console
    return {"status": "ok"}
```

### Check Database Directly

```powershell
psql -U news_user -d news_digest

# Inside psql
SELECT * FROM users;
SELECT column_name, column_type FROM information_schema.columns WHERE table_name = 'users';
\dt  # List all tables
\d users  # Describe users table
```

### Test Database Connection

```python
# Python
from app.database import engine
try:
    with engine.connect() as conn:
        print("Database connection successful!")
except Exception as e:
    print(f"Database error: {e}")
```

---

## 📦 Dependency Management

### Current Dependencies

```
FastAPI==0.104.1          Web framework
uvicorn==0.24.0           ASGI server
SQLAlchemy==2.0.23        ORM
psycopg2-binary==2.9.9    PostgreSQL driver
pydantic==2.5.0           Data validation
passlib==1.7.4            Password hashing
bcrypt==4.1.1             Bcrypt algorithm
python-dotenv==1.0.0      Environment variables
python-jose==3.3.0        JWT (future)
openai==1.3.6             Summarization (future)
apscheduler==3.10.4       Scheduling (future)
```

### Adding New Dependencies

```powershell
# Install
pip install new_package

# Update requirements
pip freeze > requirements.txt

# In version control
git add requirements.txt
```

---

## 🔄 Development Workflow

### 1. Feature Development

```
1. Create model (if needed)
   └─ app/models/mymodel.py

2. Create schemas
   └─ app/schemas/myschema.py

3. Create service
   └─ app/services/my_service.py

4. Create routes
   └─ app/routes/myroutes.py

5. Add tests
   └─ test_my_feature.py

6. Update documentation
   └─ Update relevant .md files
```

### 2. Testing

```
1. Unit test service layer
2. Integration test routes
3. Manual test with Swagger UI
4. Test error cases
5. Verify database changes
```

### 3. Code Quality

```
1. Follow PEP 8 style
2. Add type hints
3. Write docstrings
4. Use meaningful names
5. Keep functions small
```

---

## 🎯 Common Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST (new resource) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input (duplicate email) |
| 404 | Not Found | User doesn't exist |
| 422 | Validation Error | Pydantic validation failed |
| 500 | Server Error | Unexpected error |

---

## 📊 Performance Considerations

### Connection Pooling
```python
# Already configured in database.py
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True  # Tests connections
)
```

### Indexing
```python
# Already configured in user.py
email = Column(String(255), unique=True, index=True)
# Speeds up lookups by email
```

### Query Optimization
```python
# ✓ Good - returns User object
user = db.query(User).filter(User.id == 1).first()

# ✗ Avoid - returns all columns even if you need one
users = db.query(User).all()
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change `DEBUG=False`
- [ ] Generate new `SECRET_KEY`
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL
- [ ] Set up environment variables
- [ ] Configure CORS for actual domain
- [ ] Set up logging
- [ ] Test error handling
- [ ] Backup database
- [ ] Load testing
- [ ] Security audit

---

## 📞 Quick Reference Commands

```powershell
# Development
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Testing
curl http://localhost:8000/health
python test_api.py

# Database
psql -U news_user -d news_digest
SELECT * FROM users;

# Code Quality
python -m pylint app/
python -m black app/
python -m pytest tests/

# Deployment
pip freeze > requirements.txt
gunicorn app.main:app
```

---

## 🔗 Important URLs

- **API Root:** http://localhost:8000
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

---

**This is your quick reference. Bookmark it!**

For detailed explanations, see [ARCHITECTURE.md](ARCHITECTURE.md)
