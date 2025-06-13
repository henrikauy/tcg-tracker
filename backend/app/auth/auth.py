from passlib.context import CryptContext
import jwt
import os
import dotenv
from datetime import datetime, timedelta
from backend.app.crud.user import get_user_by_email
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from database.models import User

dotenv.load_dotenv()
SECRET_KEY = os.environ["JWT_KEY"]
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    """
    Create a JWT access token with the given data and expiration time.
    """
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

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

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get the current authenticated user from the JWT token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        email = payload.get("email")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return {"user_id": user_id, "email": email}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    