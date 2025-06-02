from sqlmodel import SQLModel
from database.config import engine
from database.models import User, Release, Subscription

def init_db():
  SQLModel.metadata.create_all(engine)
  print("Database initialized successfully.")

if __name__ == "__main__":
  init_db()

