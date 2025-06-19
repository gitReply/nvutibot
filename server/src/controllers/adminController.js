const { getStats } = require('../services/statsService');
const { User } = require('../models/init');
const { manualPayout } = require('../services/paymentService');

async function stats(req, res) {
  res.json(await getStats());
}

async function listUsers(req, res) {
  res.json(await User.findAll({ attributes: ['id','telegramId','nickname','balance','bonusBalance'] }));
}

async function payoutUser(req, res) {
  const { userId } = req.body;
  const amount = await manualPayout(userId);
  res.json({ paid: amount });
}

module.exports = { stats, listUsers, payoutUser };
