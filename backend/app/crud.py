from passlib.context import CryptContext
from sqlmodel import Session, select
from datetime import datetime
from database.models import User, Release, Subscription
from database.config import engine



# bcrypt context for hashing passwords
pwd_context= CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Generate a salted‐bcrypt hash for the given plain text password.
    """
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a salted‐bcrypt hash.
    Returns True if the password matches, False otherwise.
    """
    return pwd_context.verify(password, hashed_password)

def create_user(email: str, mobile: str, password: str):
    """
    Create a new user in the database.
    """
    hashed_password = hash_password(password) # Hash the password before storing it

    # Check if the user already exists
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == email)).first()
        if existing:
            raise ValueError("User with this email already exists")
        
    # Create and save the new user
        user = User(
            email=email,
            mobile=mobile,
            password_hash=hashed_password
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

def get_user_by_email(email: str) -> User | None:
    """
    Retrieve a user by their email address.
    Returns the User object if found, otherwise None.
    """
    with Session(engine) as session:
        statement = select(User).where(User.email == email)
        result = session.exec(statement).first()
        return result
        
def authenticate_user(email: str, password: str) -> User | None:
    """
    Authenticate a user by email and password.
    Returns the User object if authentication is successful, otherwise None.
    """
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user