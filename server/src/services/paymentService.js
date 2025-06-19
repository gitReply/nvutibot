const { User } = require('../models/init');
const { Settings } = require('../models/init');

async function payout(userId) {
  const user = await User.findByPk(userId);
  const settings = await Settings.findByPk(1);
  const amount = user.balance;
  if (amount <= 0) return 0;
  if (settings.autoPayout) {
    // здесь интеграция с платёжным шлюзом
    user.balance = 0;
    await user.save();
    return amount;
  }
  // если не авто, просто возвращаем заявку на выплату
  return null;
}

async function manualPayout(userId) {
  const user = await User.findByPk(userId);
  const amount = user.balance;
  user.balance = 0;
  await user.save();
  return amount;
}

module.exports = { payout, manualPayout };
