from sqlmodel import SQLModel
from config import engine
from app.models import User, Release, Subscription


def create_db_and_tables():
    # This will create tables for all models
    SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    create_db_and_tables()
    print("✅ Database and tables created successfully!")
