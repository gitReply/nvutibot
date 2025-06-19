const { Referral, User, Settings } = require('../models/init');
const { Op } = require('sequelize');

async function applyReferral(userId, code) {
  const referrer = await User.findOne({ where: { referralCode: code } });
  if (!referrer || referrer.id === userId) return;

  await User.update({ referredBy: code }, { where: { id: userId } });
}

async function creditReferral(referrerCode, amount) {
  const settings = await Settings.findOne();
  const referrer = await User.findOne({ where: { referralCode: referrerCode } });
  if (!referrer) return;

  const percent = settings.referralPercent;
  const bonus = Math.floor((amount * percent) / 100);

  referrer.bonusBalance += bonus;
  await referrer.save();

  return bonus;
}

async function createCustomReferral(code, referrerId, bonusAmount = 0) {
  return Referral.create({
    code,
    referrerId,
    bonusAmount,
    isCustom: true
  });
}

module.exports = {
  applyReferral,
  creditReferral,
  createCustomReferral
};
