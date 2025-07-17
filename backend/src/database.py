from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from src.config import get_settings

settings = get_settings()
engine = create_engine(url=settings.get_db_url)
class Base(DeclarativeBase): pass

SessionLocal = sessionmaker(engine)
def get_session():
    with SessionLocal() as session:
        yield session