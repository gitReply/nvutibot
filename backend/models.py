from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Float
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True)
    telegram_id   = Column(String, unique=True, index=True, nullable=False)
    username      = Column(String(64))
    stars         = Column(Integer, default=0)
    bonus         = Column(Integer, default=0)
    referral_code = Column(String(16), unique=True, index=True)
    referred_by   = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_admin      = Column(Boolean, default=False)
    created_at    = Column(DateTime, server_default=func.now())
    referrals     = relationship("User", backref="referrer", remote_side=[id])

class Transaction(Base):
    __tablename__ = "transactions"
    id        = Column(Integer, primary_key=True)
    user_id   = Column(Integer, ForeignKey("users.id"))
    type      = Column(String(32))
    amount    = Column(Integer)
    timestamp = Column(DateTime, server_default=func.now())

class Game(Base):
    __tablename__ = "games"
    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id"))
    bet_amount = Column(Integer)
    won_amount = Column(Integer)
    is_win     = Column(Boolean)
    random_val = Column(Float)
    timestamp  = Column(DateTime, server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id        = Column(Integer, primary_key=True)
    message   = Column(String(256))
    timestamp = Column(DateTime, server_default=func.now())
