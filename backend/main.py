import asyncio
import uvicorn
from backend.api import app
from backend.bot import start_bot, dp, bot

@app.on_event("startup")
async def on_start():
    asyncio.create_task(dp.start_polling(bot))

@app.on_event("shutdown")
async def on_shutdown():
    await bot.session.close()

if __name__=="__main__":
    uvicorn.run("backend.main:app",host="0.0.0.0",port=8000,reload=True)
