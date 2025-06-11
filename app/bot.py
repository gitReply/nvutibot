# --- file: app/bot.py
import asyncio
import secrets
from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    Message, PreCheckoutQuery, LabeledPrice,
    InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
)
from sqlalchemy import select, update
from app.config import settings
from app.db import async_session, Base, engine
from app.models import User, Transaction, Game, Notification

# Инициализация бота и диспетчера
bot = Bot(token=settings.BOT_TOKEN, parse_mode="HTML")
dp = Dispatcher()

# При старте создаём таблицы
@dp.startup()
async def on_startup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# /start - регистрация и выдача кнопки MiniApp
@dp.message(CommandStart())
async def cmd_start(msg: Message):
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.telegram_id == str(msg.from_user.id)))
        if not user:
            code = secrets.token_hex(4)
            user = User(
                telegram_id=str(msg.from_user.id),
                username=msg.from_user.username or msg.from_user.full_name,
                stars=0,
                bonus=0,
                referral_code=code,
                referred_by=None,
                is_admin=(msg.from_user.id == settings.ADMIN_ID)
            )
            s.add(user)
            await s.commit()
    kb = InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="Играть в NVUTI", web_app=WebAppInfo(url=settings.WEBAPP_URL))
    ]])
    await msg.answer("Добро пожаловать в NVUTI Stars Casino! 💫", reply_markup=kb)

# /set_rtp <percent> - админ
@dp.message(Command("set_rtp"))
async def cmd_set_rtp(msg: Message):
    if msg.from_user.id != settings.ADMIN_ID:
        return
    parts = msg.text.split()
    if len(parts)!=2 or not parts[1].isdigit():
        return await msg.answer("Использование: /set_rtp <целый_процент>")
    settings.RTP_PERCENT = int(parts[1])
    await msg.answer(f"RTP установлен на {settings.RTP_PERCENT}%")

# /set_ref <percent> - админ
@dp.message(Command("set_ref"))
async def cmd_set_ref(msg: Message):
    if msg.from_user.id != settings.ADMIN_ID:
        return
    parts = msg.text.split()
    if len(parts)!=2 or not parts[1].isdigit():
        return await msg.answer("Использование: /set_ref <целый_процент>")
    settings.REFERRAL_PERCENT = int(parts[1])
    await msg.answer(f"Реферальный процент установлен на {settings.REFERRAL_PERCENT}%")

# /withdraw <N> - запрос на вывод
@dp.message(Command("withdraw"))
async def cmd_withdraw(msg: Message):
    parts = msg.text.split()
    if len(parts)!=2 or not parts[1].isdigit():
        return await msg.answer("Использование: /withdraw <количество_звёзд>")
    amount = int(parts[1])
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.telegram_id==str(msg.from_user.id)))
        if not user or user.stars < amount:
            return await msg.answer("Недостаточно звёзд.")
        user.stars -= amount
        s.add(Transaction(user_id=user.id, type="withdraw", amount=-amount))
        await s.commit()
    await msg.answer(f"Запрос на вывод {amount}⭐ зарегистрирован.")

# Игровой WebApp-платёж (Stars)
@dp.message(Command("deposit"))
async def cmd_deposit(msg: Message):
    prices = [LabeledPrice(label="Звёзды", amount=100)]  # 1.00 XTR = 100
    await bot.send_invoice(
        chat_id=msg.chat.id,
        title="Пополнение баланса NVUTI Stars",
        description="Купите звёзды для игры",
        payload=f"deposit:{msg.from_user.id}",
        provider_token="",  # пустой токен для XTR
        currency="XTR",
        prices=prices
    )

@dp.pre_checkout_query()
async def pre_checkout(query: PreCheckoutQuery):
    await bot.answer_pre_checkout_query(query.id, ok=True)

@dp.message(F.successful_payment)
async def pay_success(msg: Message):
    pay = msg.successful_payment
    user_id_str, _ = pay.invoice_payload.split(":")
    stars = pay.total_amount  # уже целое кол-во звёзд
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.telegram_id==user_id_str))
        if not user:
            return
        user.stars += stars
        s.add(Transaction(user_id=user.id, type="deposit", amount=stars))
        # реферальный бонус
        if user.referred_by:
            bonus = stars * settings.REFERRAL_PERCENT // 100
            ref = await s.get(User, user.referred_by)
            if ref:
                ref.stars += bonus
                s.add(Transaction(user_id=ref.id, type="referral", amount=bonus))
        await s.commit()
    await msg.answer(f"Пополнение на {stars}⭐ выполнено! Balance: {user.stars}⭐")

# Запуск polling
def start_bot():
    dp.run_polling(bot)

if __name__ == "__main__":
    start_bot()
