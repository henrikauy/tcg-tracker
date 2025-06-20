import os
from sqlmodel import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:your_password@localhost:5432/pokecard"
)
engine = create_engine(DATABASE_URL, echo=True)