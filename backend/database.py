from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from backend.config import settings

engine = create_async_engine(settings.DATABASE_URL, future=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()
