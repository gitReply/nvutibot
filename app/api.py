# app/api.py
import random
import secrets
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy import select
from app.db import async_session, engine, Base
from app.models import User, Transaction, Game, Notification
from app.config import settings

app = FastAPI()

# Создаём таблицы при старте
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Логика игры NVUTI
def play_nvuti_logic(bet: int):
    P = settings.RTP_PERCENT / 100.0
    win = random.random() < P
    win_amount = bet * 2 if win else 0
    return win, win_amount, secrets.randbelow(10000) / 10000.0

@app.post("/api/balance")
async def api_balance(req: Request):
    data = await req.json()
    tg_id = data.get("tg_id")
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.tg_id == str(tg_id)))
        if not user:
            raise HTTPException(404, "User not found")
        return {"balance": user.stars, "bonus": user.bonus, "is_admin": user.is_admin}

@app.post("/api/play")
async def api_play(req: Request):
    data = await req.json()
    tg_id = data.get("tg_id")
    bet = data.get("bet")
    if not isinstance(bet, int) or bet < 1:
        raise HTTPException(400, "Invalid bet")
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.tg_id == str(tg_id)))
        if not user or user.stars < bet:
            raise HTTPException(400, "Insufficient stars")
        # игра
        win, won, rnd = play_nvuti_logic(bet)
        # обновляем баланс и логи
        user.stars = user.stars - bet + won
        s.add(Transaction(user_id=user.id, type="bet", amount=-bet))
        if win:
            s.add(Transaction(user_id=user.id, type="win", amount=won))
        s.add(Game(user_id=user.id, bet_amount=bet, won_amount=won, is_win=win, random_val=rnd))
        await s.commit()
        msg = f"{'🎉 Победа!' if win else '😢 Проигрыш.'} Новый баланс: {user.stars}⭐"
        return {"new_balance": user.stars, "result": msg}

@app.post("/api/admin/notify")
async def api_notify(req: Request):
    data = await req.json()
    content = data.get("content")
    async with async_session() as s:
        s.add(Notification(content=content))
        await s.commit()
    return {"ok": True}
