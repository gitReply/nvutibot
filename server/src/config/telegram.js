const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('./settings');

const bot = new TelegramBot(telegramBotToken, {
  polling: true
});

module.exports = bot;
