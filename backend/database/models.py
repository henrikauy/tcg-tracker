from typing import Optional, List
from datetime import datetime, date
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  email: str = Field(index=True, unique=True)
  mobile: str
  password_hash: str
  created_at: datetime = Field(default_factory=datetime.now)

  subscriptions: List["Subscription"] = Relationship(back_populates="user")

class Release(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  name: str
  url: str = Field(index=True, unique=True)
  source: str
  status: str
  last_checked: datetime = Field(default_factory=datetime.now)
  image: Optional[str] = None
  price: Optional[float] = None

  subscriptions: List["Subscription"] = Relationship(back_populates="release")

class Subscription(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
  release_id: int = Field(foreign_key="release.id", ondelete="CASCADE")
  created_at: datetime = Field(default_factory=datetime.now)
  last_notification: Optional[date] = None

  user: Optional[User] = Relationship(back_populates="subscriptions")
  release: Optional[Release] = Relationship(back_populates="subscriptions")

  