import os
from sqlmodel import create_engine
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:your_password@localhost:5432/pokecard"
)
print("DATABASE_URL:", DATABASE_URL)
engine = create_engine(DATABASE_URL, echo=True)