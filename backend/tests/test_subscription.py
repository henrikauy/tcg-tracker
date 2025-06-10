import pytest
from sqlmodel import Session
from datetime import datetime, timedelta

from database.models import User, Release, Subscription
from database.config import engine
from backend.app.crud.subscription import (
    get_user_subscriptions,
    create_subscription,
    delete_subscription,
    get_subscribers_for_release,
    update_last_notification,
)

import uuid

@pytest.fixture
def user_and_release():
    with Session(engine) as session:
        unique_email = f"subtest-{uuid.uuid4()}@example.com"
        user = User(email=unique_email, mobile="123", password_hash="hash")
        unique_url = f"http://testrelease-{uuid.uuid4()}"
        release = Release(name="Test Release", url=unique_url, source="test", status="pre-order")
        session.add(user)
        session.add(release)
        session.commit()
        session.refresh(user)
        session.refresh(release)
        yield user, release
        # Teardown
        session.delete(user)
        session.delete(release)
        session.commit()

def test_create_and_get_subscription(user_and_release):
    user, release = user_and_release
    sub = create_subscription(user.id, release.id)
    assert sub.user_id == user.id
    assert sub.release_id == release.id

    subs = get_user_subscriptions(user.id)
    assert any(s.id == sub.id for s in subs)

def test_create_duplicate_subscription_raises(user_and_release):
    user, release = user_and_release
    create_subscription(user.id, release.id)
    with pytest.raises(ValueError):
        create_subscription(user.id, release.id)

def test_delete_subscription(user_and_release):
    user, release = user_and_release
    sub = create_subscription(user.id, release.id)
    delete_subscription(sub.id)
    subs = get_user_subscriptions(user.id)
    assert all(s.id != sub.id for s in subs)

def test_delete_nonexistent_subscription_raises():
    with pytest.raises(ValueError):
        delete_subscription(999999)

def test_get_subscribers_for_release(user_and_release):
    user, release = user_and_release
    create_subscription(user.id, release.id)
    users = get_subscribers_for_release(release.id)
    assert any(u.id == user.id for u in users)

def test_update_last_notification(user_and_release):
    user, release = user_and_release
    sub = create_subscription(user.id, release.id)
    new_time = datetime.now() + timedelta(days=1)
    update_last_notification(sub.id, new_time)
    with Session(engine) as session:
        updated = session.get(Subscription, sub.id)
        assert updated.last_notification == new_time.date()