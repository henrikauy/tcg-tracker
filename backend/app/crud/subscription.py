from sqlmodel import Session, select
from database.models import Subscription, User, Release
from database.config import engine
from typing import List, Optional
from datetime import datetime

def get_user_subscriptions(user_id: int) -> List[Subscription]:
    """
    Retrieve all subscriptions for a given user.
    """
    with Session(engine) as session:
        statement = select(Subscription).where(Subscription.user_id == user_id)
        return session.exec(statement).all()
    
def create_subscription(user_id: int, release_id: int) -> Subscription:
    """
    Create a new subscription for a user to a specific release.
    """
    with Session(engine) as session:
        # Check if the subscription already exists
        existing = session.exec(
            select(Subscription).where(
                Subscription.user_id == user_id,
                Subscription.release_id == release_id
            )
        )

        # If a subscription already exists, raise an error
        if existing.first():
            raise ValueError("Subscription already exists for this user and release")
        
        # Create and save the new subscription
        subscription = Subscription(
            user_id=user_id,
            release_id=release_id
        )
        session.add(subscription)
        session.commit()
        session.refresh(subscription)
        return subscription

def delete_subscription(subscription_id: int) -> None:
    """
    Delete a subscription by its ID.
    """
    with Session(engine) as session:
        subscription = session.exec(select(Subscription).where(Subscription.id == subscription_id)).first()

        if not subscription:
            raise ValueError("Subscription not found")
        
        session.delete(subscription)
        session.commit()

def get_subscribers_for_release(release_id: int) -> List[User]:
    """
    Retrieve all users subscribed to a specific release.
    """
    with Session(engine) as session:
        statement = select(User).join(Subscription).where(Subscription.release_id == release_id)
        return session.exec(statement).all()
    
def update_last_notification(subscription_id: int, time: datetime) -> None:
    """
    Update the last notification date for a subscription.
    """
    with Session(engine) as session:
        subscription = session.exec(select(Subscription).where(Subscription.id == subscription_id)).first()

        if not subscription:
            raise ValueError("Subscription not found")

        subscription.last_notification = time
        session.add(subscription)
        session.commit()

