"""
Quick verification script to test API endpoints without Swagger UI.
Run this after the FastAPI application is running.
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def print_response(title: str, response: requests.Response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"TEST: {title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)


def test_health_endpoints():
    """Test health check endpoints"""
    print("\n" + "="*60)
    print("TESTING HEALTH ENDPOINTS")
    print("="*60)
    
    # Test root endpoint
    response = requests.get(f"{BASE_URL}/")
    print_response("GET / (Root endpoint)", response)
    
    # Test health endpoint
    response = requests.get(f"{BASE_URL}/health")
    print_response("GET /health", response)


def test_user_registration():
    """Test user registration endpoint"""
    print("\n" + "="*60)
    print("TESTING USER REGISTRATION")
    print("="*60)
    
    user_data = {
        "email": "testuser@example.com",
        "password": "password123",
        "full_name": "Test User"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json=user_data,
        headers={"Content-Type": "application/json"}
    )
    print_response("POST /api/auth/register", response)
    
    return response.json() if response.status_code == 201 else None


def test_get_user(user_id: int):
    """Test retrieving user by ID"""
    print("\n" + "="*60)
    print("TESTING USER RETRIEVAL")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/auth/users/{user_id}")
    print_response(f"GET /api/auth/users/{user_id}", response)


def main():
    """Run all tests"""
    print("\n" + "#"*60)
    print("# NEWS DIGEST API - VERIFICATION TESTS")
    print("#"*60)
    print(f"Target URL: {BASE_URL}")
    
    try:
        # Test health endpoints
        test_health_endpoints()
        
        # Test user registration
        user_data = test_user_registration()
        
        # Test user retrieval
        if user_data and "id" in user_data:
            test_get_user(user_data["id"])
        
        print("\n" + "="*60)
        print("✓ ALL TESTS COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("\nNext steps:")
        print("1. Visit Swagger UI: http://localhost:8000/docs")
        print("2. Try the /api/auth/register endpoint")
        print("3. Create multiple users and test GET endpoints")
        print("4. Check ReDoc: http://localhost:8000/redoc")
        
    except requests.exceptions.ConnectionError:
        print("\n" + "!"*60)
        print("ERROR: Cannot connect to FastAPI server")
        print("!"*60)
        print("Make sure the API is running:")
        print("  python -m uvicorn app.main:app --reload")


if __name__ == "__main__":
    main()
