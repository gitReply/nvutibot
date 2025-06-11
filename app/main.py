# app/main.py
import asyncio
import uvicorn
from app.api import app as api_app
from app.bot import dp, bot

# При старте FastAPI запускаем aiogram в фоне
@api_app.on_event("startup")
async def start_bot():
    asyncio.create_task(dp.start_polling(bot))

# Корректно закрываем бота
@api_app.on_event("shutdown")
async def shutdown_bot():
    await bot.session.close()

if __name__ == "__main__":
    uvicorn.run("app.main:api_app", host="0.0.0.0", port=8000, reload=True)
