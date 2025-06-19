require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  referralDefaultPercent: Number(process.env.REFERRAL_PERCENT) || 5,
  payoutDefaultPercent: Number(process.env.PAYOUT_PERCENT) || 95
};
