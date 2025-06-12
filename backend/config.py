import os
from dotenv import load_dotenv
load_dotenv()

class Settings:
    BOT_TOKEN        = os.getenv("BOT_TOKEN")
    ADMIN_ID         = int(os.getenv("ADMIN_ID", "0"))
    DATABASE_URL     = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///nvuti.db")
    RTP_PERCENT      = int(os.getenv("RTP_PERCENT", "90"))
    REFERRAL_PERCENT = int(os.getenv("REFERRAL_PERCENT", "5"))
    WEBAPP_URL       = os.getenv("WEBAPP_URL", "https://comet.sale")

settings = Settings()
