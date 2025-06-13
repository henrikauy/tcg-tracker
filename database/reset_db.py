from sqlmodel import SQLModel
from database.config import engine
from database.models import User, Release, Subscription

def reset_db():
    # Drop all tables
    SQLModel.metadata.drop_all(engine)
    print("All tables dropped.")
    # Recreate all tables
    SQLModel.metadata.create_all(engine)
    print("All tables created.")

if __name__ == "__main__":
    reset_db()