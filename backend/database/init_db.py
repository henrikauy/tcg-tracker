from sqlmodel import SQLModel
from backend.database.config import engine
from backend.database.models import User, Release, Subscription

def init_db():
  SQLModel.metadata.create_all(engine)
  print("Database initialized successfully.")
  

if __name__ == "__main__":
  init_db()

