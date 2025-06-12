from fastapi import FastAPI, HTTPException
from sqlalchemy import select
from backend.database import async_session, engine, Base
from backend.models import User, Game, Notification
from backend.config import settings

app = FastAPI()

# создаём таблицы
@app.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# логика игры
import random
def play_nvuti_logic(bet:int):
    P = settings.RTP_PERCENT/100
    win = random.random()<P
    return win, bet*2 if win else 0, random.random()

@app.post("/api/balance")
async def balance(data: dict):
    tg = str(data.get("tg_id"))
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.telegram_id==tg))
    if not user: raise HTTPException(404)
    return {"balance":user.stars,"bonus":user.bonus,"is_admin":user.is_admin}

@app.post("/api/play")
async def play(data: dict):
    tg = str(data.get("tg_id")); bet=data.get("bet")
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.telegram_id==tg))
        if not user or not isinstance(bet,int) or bet<1 or user.stars<bet:
            raise HTTPException(400)
        win, won, rnd = play_nvuti_logic(bet)
        user.stars = user.stars - bet + won
        s.add(Game(user_id=user.id,bet_amount=bet,won_amount=won,is_win=win,random_val=rnd))
        await s.commit()
    return {"new_balance":user.stars,"result":("🎉" if win else "😢")+f" {won}⭐"}

@app.post("/api/admin/notify")
async def notify(data: dict):
    msg=data.get("content")
    async with async_session() as s:
        s.add(Notification(message=msg))
        await s.commit()
    return {"ok":True}
