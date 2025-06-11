# app/models.py
from sqlalchemy import (
    Column, Integer, String, Boolean,
    DateTime, ForeignKey, Float
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db import Base

class User(Base):
    __tablename__ = "users"
    id             = Column(Integer, primary_key=True)
    telegram_id    = Column(String, unique=True, index=True, nullable=False)
    username       = Column(String(64))
    avatar_url     = Column(String(256))
    stars          = Column(Integer, default=0)    # основ­ной баланс
    bonus          = Column(Integer, default=0)    # бонусный (невыводимый)
    referral_code  = Column(String(16), unique=True, index=True)
    referred_by    = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_admin       = Column(Boolean, default=False)
    created_at     = Column(DateTime, server_default=func.now())

    # связь с рефералами
    referrals      = relationship("User", backref="referrer", remote_side=[id])

class Transaction(Base):
    __tablename__ = "transactions"
    id             = Column(Integer, primary_key=True)
    user_id        = Column(Integer, ForeignKey("users.id"), nullable=False)
    type           = Column(String(32))   # deposit, withdraw, bet, win, referral_bonus
    amount         = Column(Integer)
    timestamp      = Column(DateTime, server_default=func.now())

class Game(Base):
    __tablename__ = "games"
    id             = Column(Integer, primary_key=True)
    user_id        = Column(Integer, ForeignKey("users.id"), nullable=False)
    bet_amount     = Column(Integer)
    won_amount     = Column(Integer)
    is_win         = Column(Boolean)
    random_val     = Column(Float)
    timestamp      = Column(DateTime, server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id             = Column(Integer, primary_key=True)
    message        = Column(String(256))
    timestamp      = Column(DateTime, server_default=func.now())
