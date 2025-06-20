from sqlmodel import Session, select
from backend.database.models import Subscription, User, Release
from backend.database.config import engine
from typing import List, Optional
from datetime import datetime


def get_user_subscriptions(user_id: int) -> List[Subscription]:
    """
    Retrieve all subscriptions for a given user.
    """
    with Session(engine) as session:
        statement = (
            select(Release)
            .join(Subscription, Subscription.release_id == Release.id)
            .where(Subscription.user_id == user_id)
        )
        return session.exec(statement).all()


def create_subscription(user_id: int, release_id: int) -> Subscription:
    """
    Create a new subscription for a user to a specific release.
    """
    with Session(engine) as session:
        # Check if the subscription already exists
        existing = session.exec(
            select(Subscription).where(
                Subscription.user_id == user_id, Subscription.release_id == release_id
            )
        )

        # If a subscription already exists, raise an error
        if existing.first():
            return existing

        # Create and save the new subscription
        subscription = Subscription(user_id=user_id, release_id=release_id)
        session.add(subscription)
        session.commit()
        session.refresh(subscription)
        return subscription


def delete_subscription(user_id: int, release_id: int) -> bool:
    """
    Delete a subscription by user_id and release_id.
    Returns True if deleted, False if not found.
    """
    with Session(engine) as session:
        subscription = session.exec(
            select(Subscription).where(
                Subscription.user_id == user_id, Subscription.release_id == release_id
            )
        ).first()
        if not subscription:
            return False
        session.delete(subscription)
        session.commit()
        return True


def get_subscribers_for_release(release_id: int) -> List[User]:
    """
    Retrieve all users subscribed to a specific release.
    """
    with Session(engine) as session:
        statement = (
            select(User).join(Subscription).where(Subscription.release_id == release_id)
        )
        return session.exec(statement).all()


def update_last_notification(subscription_id: int, time: datetime) -> None:
    """
    Update the last notification date for a subscription.
    """
    with Session(engine) as session:
        subscription = session.exec(
            select(Subscription).where(Subscription.id == subscription_id)
        ).first()

        if not subscription:
            raise ValueError("Subscription not found")

        subscription.last_notification = time
        session.add(subscription)
        session.commit()
