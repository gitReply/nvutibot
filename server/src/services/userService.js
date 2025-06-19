const { User } = require('../models/init');
const { Op } = require('sequelize');

async function getOrCreateUser(telegramId, nickname, avatarUrl = null) {
  let user = await User.findOne({ where: { telegramId } });

  if (!user) {
    user = await User.create({
      telegramId,
      nickname,
      avatarUrl,
      referralCode: `ref-${telegramId}`
    });
  }

  return user;
}

async function getUserByReferralCode(code) {
  return User.findOne({ where: { referralCode: code } });
}

async function updateBalance(userId, delta) {
  const user = await User.findByPk(userId);
  user.balance += delta;
  await user.save();
  return user;
}

async function setBonusBalance(userId, amount) {
  const user = await User.findByPk(userId);
  user.bonusBalance = amount;
  await user.save();
  return user;
}

module.exports = {
  getOrCreateUser,
  getUserByReferralCode,
  updateBalance,
  setBonusBalance
};
