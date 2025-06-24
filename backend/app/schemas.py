from pydantic import BaseModel

class SignupRequest(BaseModel):
    email: str
    mobile: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ReleaseUpdate(BaseModel):
    name: str
    url: str
    source: str
    status: str
    image: str
    price: float

class ReleaseRead(BaseModel):
    id: int
    name: str
    url: str
    source: str
    status: str
    image: str
    price: float

class SubscriptionRequest(BaseModel):
    release_id: int

class SearchItem(BaseModel):
    id: str
    name: str
    price: float
    in_stock: bool
    image_url: str
    url: str