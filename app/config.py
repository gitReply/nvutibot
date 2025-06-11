# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    BOT_TOKEN       = os.getenv("BOT_TOKEN")
    ADMIN_ID        = int(os.getenv("ADMIN_ID", "0"))
    DATABASE_URL    = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///nvuti.db")
    RTP_PERCENT     = int(os.getenv("RTP_PERCENT", "90"))
    REFERRAL_PERCENT= int(os.getenv("REFERRAL_PERCENT", "5"))
    AUTO_WITHDRAW   = os.getenv("AUTO_WITHDRAW", "false").lower() == "true"
    WEBAPP_URL      = os.getenv("WEBAPP_URL", "http://localhost:8000/")
    
settings = Settings()
