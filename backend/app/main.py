from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel
from backend.app.crud.user import create_user, get_user_by_email
from backend.app.crud.release import (
    get_release_by_url,
    get_release_by_id,
    upsert_release,
    get_all_releases,
    delete_release_by_id,
)
from backend.app.crud.subscription import (
    get_user_subscriptions,
    create_subscription,
    delete_subscription,
    get_subscribers_for_release,
)
from backend.app.auth.auth import (
    authenticate_user,
    get_current_user,
    create_access_token,
)
from backend.app.scraper.scraper_bigw import fetch_bigw
from backend.database.models import User, Release, Subscription
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from backend.app.schemas import (
    SignupRequest,
    LoginRequest,
    ReleaseUpdate,
    ReleaseRead,
    SubscriptionRequest,
    SearchItem,
)
from backend.app.crud.release import remove_missing_releases

app = FastAPI()

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------- User Management Endpoints -----------------------------------


@app.post("/signup")
def signup(request: SignupRequest):
    """Register a new user."""
    existing = get_user_by_email(request.email)
    if existing:
        raise HTTPException(
            status_code=400, detail="User with this email already exists"
        )
    user = create_user(
        email=request.email, mobile=request.mobile, password=request.password
    )
    return {"id": user.id, "email": user.email, "mobile": user.mobile}


@app.post("/login")
def login(request: LoginRequest):
    """Authenticate user and return JWT token."""
    user = authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    # Create JWT token
    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
    }


# --------------------------- Release Management Endpoints --------------------------------


@app.get("/releases/{release_id}", response_model=ReleaseRead)
def read_release_by_id(release_id: int):
    """Retrieve a release by its ID."""
    release = get_release_by_id(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    return release


@app.get("/releases/url/{url}", response_model=ReleaseRead)
def read_release_by_url(url: str):
    """Retrieve a release by its URL."""
    release = get_release_by_url(url)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    return release


@app.get("/releases", response_model=list[ReleaseRead])
def read_all_releases():
    """Retrieve all releases."""
    releases = get_all_releases()
    return releases


@app.post("/releases", response_model=ReleaseRead)
def create_and_subscribe_release(
    info: ReleaseUpdate, current_user: User = Depends(get_current_user)
):
    """
    Create or update a release and subscribe the user to it.
    """
    info_dict = info.model_dump()
    info_dict["last_checked"] = datetime.now()
    release = upsert_release(info_dict)
    create_subscription(current_user.id, release.id)
    return release


@app.delete("/releases/{release_id}", status_code=204)
def unsubscribe_and_maybe_delete_release(
    release_id: int, current_user: User = Depends(get_current_user)
):
    """
    Remove the user's subscription to the release.
    If no one is subscribed after, delete the release.
    """
    # Remove the user's subscription
    deleted = delete_subscription(current_user.id, release_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Subscription not found")
    # Check if anyone else is subscribed
    subscribers = get_subscribers_for_release(release_id)
    if not subscribers:
        # No one is subscribed, delete the release
        delete_release_by_id(release_id)
    return


# --------------------------- Subscription Management Endpoints ---------------------------


@app.get("/me/subscriptions", response_model=list[ReleaseRead])
def get_my_subscriptions(current_user: User = Depends(get_current_user)):
    """Retrieve all subscriptions for the current user."""
    return get_user_subscriptions(current_user.id)


@app.post("/me/subscriptions")
def add_subscription(
    req: SubscriptionRequest, current_user: User = Depends(get_current_user)
):
    """Subscribe the current user to a release by its ID."""
    release_id = req.release_id
    release = get_release_by_id(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    subscription = create_subscription(current_user.id, release_id)
    return subscription


@app.delete("/me/subscriptions/{release_id}", status_code=204)
def remove_subscription(
    req: SubscriptionRequest, current_user: User = Depends(get_current_user)
):
    """Remove the current user's subscription to a release by its ID."""
    release_id = req.release_id
    deleted = delete_subscription(current_user.id, release_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"message": "Subscription deleted successfully"}


# --------------------------- Product Fetching Endpoints -----------------------------------

# Map source names to their fetch functions
source_map = {
    "bigw": fetch_bigw,
}


@app.get("/fetch/{source}", response_model=list[SearchItem])
def get_products(source: str, available: bool | None = Query(None)):
    """
    Fetch products from a given source.
    Optionally filter by availability.
    """
    fetch_function = source_map.get(source.lower())
    if not fetch_function:
        raise HTTPException(status_code=404, detail="Source not found")
    all_items = fetch_function()

    # Collect all scraped URLs
    scraped_urls = set(item.url for item in all_items)

    # Remove missing releases for this source
    remove_missing_releases(source, scraped_urls)

    # Upsert current releases
    for item in all_items:
        info = {
            "name": item.name,
            "url": item.url,
            "source": source.capitalize(),
            "status": "In Stock" if item.in_stock else "Out of Stock",
            "last_checked": datetime.now(),
            "image": item.image_url,
            "price": item.price if hasattr(item, "price") else None
        }
        upsert_release(info)
    return all_items

