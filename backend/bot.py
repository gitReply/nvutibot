import secrets
from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    Message, InlineKeyboardMarkup, InlineKeyboardButton,
    WebAppInfo, PreCheckoutQuery, LabeledPrice
)
from sqlalchemy import select
from backend.config import settings
from backend.database import async_session, engine, Base
from backend.models import User, Transaction
from backend.api import play_nvuti_logic

bot = Bot(token=settings.BOT_TOKEN, parse_mode="HTML")
dp = Dispatcher()

@dp.startup()
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# /start
@dp.message(CommandStart())
async def cmd_start(msg: Message):
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.telegram_id==str(msg.from_user.id)))
        if not user:
            code = secrets.token_hex(4)
            user = User(
                telegram_id=str(msg.from_user.id),
                username=msg.from_user.username or msg.from_user.full_name,
                stars=0, bonus=0,
                referral_code=code,
                referred_by=None,
                is_admin=(msg.from_user.id==settings.ADMIN_ID)
            )
            s.add(user); await s.commit()
    kb = InlineKeyboardMarkup(inline_keyboard=[[ 
        InlineKeyboardButton(
            text="Играть в NVUTI",
            web_app=WebAppInfo(url=settings.WEBAPP_URL)
        )
    ]])
    await msg.answer("Добро пожаловать! 🎰", reply_markup=kb)

# /set_rtp
@dp.message(Command("set_rtp"))
async def cmd_set_rtp(msg: Message):
    if msg.from_user.id != settings.ADMIN_ID: return
    parts = msg.text.split()
    if len(parts)!=2 or not parts[1].isdigit():
        return await msg.answer("Использование: /set_rtp <процент>", parse_mode=None)
    settings.RTP_PERCENT = int(parts[1])
    await msg.answer(f"RTP={settings.RTP_PERCENT}%")

# /set_ref
@dp.message(Command("set_ref"))
async def cmd_set_ref(msg: Message):
    if msg.from_user.id != settings.ADMIN_ID: return
    parts = msg.text.split()
    if len(parts)!=2 or not parts[1].isdigit():
        return await msg.answer("Использование: /set_ref <процент>", parse_mode=None)
    settings.REFERRAL_PERCENT = int(parts[1])
    await msg.answer(f"REF={settings.REFERRAL_PERCENT}%")

# /withdraw N
@dp.message(Command("withdraw"))
async def cmd_withdraw(msg: Message):
    parts = msg.text.split()
    if len(parts)!=2 or not parts[1].isdigit():
        return await msg.answer("Использование: /withdraw <N>", parse_mode=None)
    amount = int(parts[1])
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.telegram_id==str(msg.from_user.id)))
        if not user or user.stars<amount:
            return await msg.answer("Недостаточно звёзд")
        user.stars -= amount
        s.add(Transaction(user_id=user.id,type="withdraw",amount=-amount))
        await s.commit()
    await msg.answer(f"Вывод {amount}⭐ зарегистрирован")

# /deposit N
@dp.message(Command("deposit"))
async def cmd_deposit(msg: Message):
    parts = msg.text.split()
    if len(parts)!=2 or not parts[1].isdigit():
        return await msg.answer("Использование: /deposit <N>", parse_mode=None)
    stars = int(parts[1])
    if stars<=0:
        return await msg.answer("N>0", parse_mode=None)
    price = [LabeledPrice(label=f"{stars}⭐", amount=stars)]
    await bot.send_invoice(
        chat_id=msg.chat.id,
        title="Пополнение",
        description=f"{stars} звёзд",
        payload=f"deposit:{msg.from_user.id}",
        provider_token="", currency="XTR", prices=price
    )

@dp.pre_checkout_query()
async def pre_checkout(q: PreCheckoutQuery):
    await bot.answer_pre_checkout_query(q.id, ok=True)

@dp.message(F.successful_payment)
async def on_pay(msg: Message):
    stars = msg.successful_payment.total_amount
    async with async_session() as s:
        user = await s.scalar(select(User).where(User.telegram_id==str(msg.from_user.id)))
        user.stars += stars
        s.add(Transaction(user_id=user.id,type="deposit",amount=stars))
        # referral bonus
        if user.referred_by:
            bonus = stars*settings.REFERRAL_PERCENT//100
            ref = await s.get(User,user.referred_by)
            ref.stars += bonus
            s.add(Transaction(user_id=ref.id,type="referral",amount=bonus))
        await s.commit()
    await msg.answer(f"Пополнено {stars}⭐; баланс {user.stars}⭐")

def start_bot():
    dp.run_polling(bot)

if __name__=="__main__":
    start_bot()
