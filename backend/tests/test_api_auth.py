# File: backend/app/test_api_auth.py

import pytest
from fastapi.testclient import TestClient

# Import your FastAPI app object
from backend.app.main import app

from sqlmodel import SQLModel, Session, create_engine
from database.models import User
from database.config import engine as prod_engine, DATABASE_URL

# Create an in-memory SQLite engine for testing
from sqlalchemy.pool import StaticPool
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

import backend.app.crud.user as crud_module

@pytest.fixture(autouse=True)
def create_test_db_and_client(monkeypatch):
    # 1. Create all tables in the test engine
    SQLModel.metadata.create_all(test_engine)

    # 2. Monkey-patch the crud module’s engine to use test_engine
    monkeypatch.setattr(crud_module, "engine", test_engine)

    # 3. Return a TestClient for our FastAPI app
    client = TestClient(app)
    yield client

    # 4. Drop tables after tests
    SQLModel.metadata.drop_all(test_engine)

def test_signup_and_login_flow(create_test_db_and_client):
    client = create_test_db_and_client

    # 1. Sign up a new user
    signup_payload = {
        "email": "dave@test.com",
        "mobile": "+61123456789",
        "password": "SecretPwd!"
    }
    response = client.post("/signup", json=signup_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "dave@test.com"
    assert "id" in data

    # 2. Attempt to sign up with the same email again (expect 400)
    response2 = client.post("/signup", json=signup_payload)
    assert response2.status_code == 400
    assert response2.json()["detail"] == "User with this email already exists"

    # 3. Log in with correct credentials
    login_payload = {
        "email": "dave@test.com",
        "password": "SecretPwd!"
    }
    res_login = client.post("/login", json=login_payload)
    assert res_login.status_code == 200
    assert res_login.json()["message"] == "Login successful"
    assert res_login.json()["user_id"] == data["id"]

    # 4. Log in with wrong password (expect 401)
    bad_login = client.post("/login", json={"email": "dave@test.com", "password": "Wrong!"})
    assert bad_login.status_code == 401
    assert bad_login.json()["detail"] == "Invalid email or password"

    # 5. Log in with nonexistent email (expect 401)
    missing_login = client.post("/login", json={"email": "doesnt@exist.com", "password": "irrelevant"})
    assert missing_login.status_code == 401
    assert missing_login.json()["detail"] == "Invalid email or password"
