import pytest
from sqlmodel import Session
from database.models import User
from database.config import engine
from backend.app.crud import create_user, get_user_by_email, authenticate_user, pwd_context

TEST_EMAIL = "pytest_user@example.com"
TEST_MOBILE = "+10000000000"
TEST_PASSWORD = "pytestpassword"

@pytest.fixture(autouse=True)
def cleanup_user():
    from sqlmodel import select
    # Remove test user before and after each test
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == TEST_EMAIL)).first()
        if user:
            session.delete(user)
            session.commit()
    yield
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == TEST_EMAIL)).first()
        if user:
            session.delete(user)
            session.commit()

def test_create_user():
    user = create_user(TEST_EMAIL, TEST_MOBILE, TEST_PASSWORD)
    assert user.email == TEST_EMAIL
    assert user.mobile == TEST_MOBILE
    assert user.password_hash != TEST_PASSWORD  # Should be hashed

def test_get_user_by_email():
    create_user(TEST_EMAIL, TEST_MOBILE, TEST_PASSWORD)
    user = get_user_by_email(TEST_EMAIL)
    assert user is not None
    assert user.email == TEST_EMAIL

def test_authenticate_user_success():
    create_user(TEST_EMAIL, TEST_MOBILE, TEST_PASSWORD)
    user = authenticate_user(TEST_EMAIL, TEST_PASSWORD)
    assert user is not None
    assert user.email == TEST_EMAIL

def test_authenticate_user_fail_wrong_password():
    create_user(TEST_EMAIL, TEST_MOBILE, TEST_PASSWORD)
    user = authenticate_user(TEST_EMAIL, "wrongpassword")
    assert user is None

def test_authenticate_user_fail_no_user():
    user = authenticate_user("notfound@example.com", "irrelevant")
    assert user is None

def test_auth_flow():
    # 1. Ensure a test user exists with known credentials
    test_email = "carol@example.com"
    test_pw = "MySecretPW!"
    existing = get_user_by_email(test_email)
    if not existing:
        create_user(email=test_email, mobile="+61411111111", password=test_pw)
        print(f"Created {test_email} with password {test_pw}")
    else:
        print(f"{test_email} already exists. Overwriting password hash.")
        # (For re‐runs, update their password hash)
        hashed = pwd_context.hash(test_pw)
        existing.password_hash = hashed
        from sqlmodel import Session
        from database.config import engine
        with Session(engine) as session:
            session.add(existing)
            session.commit()

    # 2. Attempt successful authentication
    user_ok = authenticate_user(test_email, test_pw)
    print("Auth with correct pw:", user_ok)

    # 3. Attempt failed authentication
    user_fail = authenticate_user(test_email, "WrongPassword")
    print("Auth with wrong pw:", user_fail)

if __name__ == "__main__":
    test_auth_flow()