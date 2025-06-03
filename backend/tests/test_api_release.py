# File: tests/test_api_release.py

import os
import pytest
import shutil
from datetime import datetime

from fastapi.testclient import TestClient

# 1) Override DATABASE_URL before anything else is imported.
#    We point at a local SQLite file for testing.
os.environ["DATABASE_URL"] = "sqlite:///./test_db.sqlite"

# 2) Now import the parts of your app that rely on DATABASE_URL.
#    init_db will create tables in test_db.sqlite.
from database.config import engine
from database.init_db import init_db
from backend.app.main import app

# Create a TestClient instance
client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_and_teardown_db():
    """
    This fixture runs once per test session.
    - Calls init_db() to create tables.
    - After all tests, deletes the temporary SQLite file.
    """
    # Ensure the database file does not exist at start
    try:
        os.remove("test_db.sqlite")
    except FileNotFoundError:
        pass

    # Create tables (runs SQLModel.metadata.create_all(engine))
    init_db()

    yield

    # Teardown: remove the test SQLite file
    try:
        os.remove("test_db.sqlite")
    except FileNotFoundError:
        pass


def test_get_empty_releases():
    """
    When no releases exist, GET /releases should return an empty list.
    """
    response = client.get("/releases")
    assert response.status_code == 200
    assert response.json() == []


def test_post_and_get_release():
    """
    1. POST /releases to insert a new release.
    2. GET /releases/{id} should return that same release.
    """
    payload = {
        "name": "Test Set",
        "url": "https://example.com/test-set",
        "source": "TestSource",
        "status": "pre-order"
    }

    # a) Insert a new release
    post_resp = client.post("/releases", json=payload)
    assert post_resp.status_code == 200

    data = post_resp.json()
    # The response_model ReleaseRead should include these fields:
    assert "id" in data
    assert data["name"] == payload["name"]
    assert data["url"] == payload["url"]
    assert data["source"] == payload["source"]
    assert data["status"] == payload["status"]

    release_id = data["id"]

    # b) Fetch with GET /releases/{id}
    get_resp = client.get(f"/releases/{release_id}")
    assert get_resp.status_code == 200

    data2 = get_resp.json()
    # The returned JSON should match exactly what we got on POST
    assert data2 == data


def test_get_nonexistent_release():
    """
    GET /releases/{id} where id does not exist should return 404.
    """
    response = client.get("/releases/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Release not found"


def test_upsert_release_updates_existing():
    """
    1. POST /releases with a URL to create a new release.
    2. POST /releases again using the same URL but changed status/name.
    3. Verify that the ID remains the same and fields are updated.
    """
    base_payload = {
        "name": "Upserted Set",
        "url": "https://example.com/upsert",
        "source": "TestSource",
        "status": "pre-order"
    }

    # a) First insert
    resp1 = client.post("/releases", json=base_payload)
    assert resp1.status_code == 200
    r1 = resp1.json()
    rid = r1["id"]

    # b) Second insert with same URL but updated fields
    updated_payload = {
        "name": "Upserted Set (Updated)",
        "url": "https://example.com/upsert",
        "source": "TestSource",
        "status": "in-stock"
    }
    resp2 = client.post("/releases", json=updated_payload)
    assert resp2.status_code == 200
    r2 = resp2.json()

    # The ID must remain the same
    assert r2["id"] == rid
    # The name and status fields should reflect the new payload
    assert r2["name"] == updated_payload["name"]
    assert r2["status"] == updated_payload["status"]

    # c) Fetch by ID and confirm the database row is updated
    get_resp = client.get(f"/releases/{rid}")
    assert get_resp.status_code == 200
    fetched = get_resp.json()
    assert fetched["id"] == rid
    assert fetched["name"] == updated_payload["name"]
    assert fetched["status"] == updated_payload["status"]


def test_list_all_releases():
    """
    1. Insert two new releases with different names.
    2. GET /releases should return them both.
    """
    payload1 = {
        "name": "Alpha Set",
        "url": "https://example.com/alpha",
        "source": "TestSource",
        "status": "pre-order"
    }
    payload2 = {
        "name": "Beta Set",
        "url": "https://example.com/beta",
        "source": "TestSource",
        "status": "pre-order"
    }

    resp_a = client.post("/releases", json=payload1)
    assert resp_a.status_code == 200
    resp_b = client.post("/releases", json=payload2)
    assert resp_b.status_code == 200

    list_resp = client.get("/releases")
    assert list_resp.status_code == 200
    all_items = list_resp.json()

    urls = [item["url"] for item in all_items]
    assert "https://example.com/beta" in urls
    assert "https://example.com/alpha" in urls


