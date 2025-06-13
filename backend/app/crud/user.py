from sqlmodel import Session, select
from database.models import User
from database.config import engine


def create_user(email: str, mobile: str, password: str):
    """
    Create a new user in the database.
    """
    from backend.app.auth.auth import hash_password
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
        

