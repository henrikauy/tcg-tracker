from sqlmodel import create_engine

# SQLite URL; creates db.sqlite in project root
DATABASE_URL = "sqlite:///../db/db.sqlite"
engine = create_engine(DATABASE_URL, echo=True)