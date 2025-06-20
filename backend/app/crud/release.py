from sqlmodel import Session, select
from datetime import datetime
from backend.database.models import Release
from backend.database.config import engine

def get_release_by_url(url: str) -> Release | None:
    """
    Retrieve a release by its URL.
    Returns the Release object if found, otherwise None.
    """
    with Session(engine) as session:
        statement = select(Release).where(Release.url == url)
        result = session.exec(statement).first()
        return result
    
def upsert_release(info: dict) -> Release:
    """
    Given a dict `info` with keys: name, url, source, status, release_date, last_checked,
    either update an existing Release (matching by URL), or insert a new one.
    Returns the up to date Release instance.
    """
    with Session(engine) as session:
        statement = select(Release).where(Release.url == info["url"])
        existing = session.exec(statement).first()

        if existing:
            existing.name = info["name"] = info.get("name", existing.name)
            existing.source = info["source"] = info.get("source", existing.source)
            existing.status = info["status"] = info.get("status", existing.status)
            existing.last_checked = info["last_checked"] = info.get("last_checked", datetime.now)

            session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing
        else:
            release = Release(
                name=info["name"],
                url=info["url"],
                source=info["source"],
                status=info["status"],
                last_checked=info.get("last_checked", datetime.now())
            )
            session.add(release)
            session.commit()
            session.refresh(release)
            return release

def get_all_releases() -> list[Release]:
    """
    Retrieve all releases from the database.
    Returns a list of Release objects.
    """
    with Session(engine) as session:
        statement = select(Release).order_by(Release.last_checked.desc())
        results = session.exec(statement).all()
        return results
    
def get_release_by_id(id: int) -> Release | None:
    """
    Retrieve a release by its ID.
    Returns the Release object if found, otherwise None.
    """
    with Session(engine) as session:
        statement = select(Release).where(Release.id == id)
        result = session.exec(statement).first()
        return result
    
def delete_release_by_id(id: int) -> None:
    """
    Delete a release by its ID.
    Raises an error if the release does not exist.
    """
    with Session(engine) as session:
        statement = select(Release).where(Release.id == id)
        release = session.exec(statement).first()
        if not release:
            raise ValueError("Release not found")
        
        session.delete(release)
        session.commit()