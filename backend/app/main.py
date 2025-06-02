from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from backend.app.crud import create_user, authenticate_user, get_user_by_email

app = FastAPI()

class SignupRequest(BaseModel):
    email: str
    mobile: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/signup")
def signup(request: SignupRequest):
    existing = get_user_by_email(request.email)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    user = create_user(email=request.email, mobile=request.mobile, password=request.password)
    return {"id": user.id, "email": user.email, "mobile": user.mobile}

@app.post("/login")
def login(request: LoginRequest):
    user = authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user_id": user.id, "email": user.email}

@app.get("/health")
def health_check():
    return {"status": "ok"}