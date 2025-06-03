from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from backend.app.crud.user import create_user, authenticate_user, get_user_by_email
from backend.app.crud.release import get_release_by_url, get_release_by_id, upsert_release, get_all_releases
from datetime import datetime

app = FastAPI()

# CRUD operations for user management
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

# CRUD operations for release management
class ReleaseUpdate(BaseModel):
    name: str
    url: str
    source: str
    status: str

class ReleaseRead(BaseModel):
    id: int
    name: str
    url: str
    source: str
    status: str


@app.get("/releases/{release_id}", response_model=ReleaseRead)
def read_release_by_id(release_id: int):
    """
    /GET /releases/{release_id}
    Retrieve a release by its ID.
    """
    release = get_release_by_id(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    return release

@app.get("/releases/url/{url}", response_model=ReleaseRead)
def read_release_by_url(url: str):
    """
    /GET /releases/url/{url}
    Retrieve a release by its URL.
    """
    release = get_release_by_url(url)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    return release

@app.get("/releases", response_model=list[ReleaseRead])
def read_all_releases():
    """
    /GET /releases
    Retrieve all releases.
    """
    releases = get_all_releases()
    return releases

@app.post("/releases", response_model=ReleaseRead)
def create_and_update_release(info: ReleaseUpdate):
    """
    /POST /releases
    Create or update a release based on the provided information.
    """
    info_dict = info.model_dump()
    info_dict["last_checked"] = datetime.now()
    release = upsert_release(info_dict)
    return release

@app.get("/health")
def health_check():
    return {"status": "ok"}

