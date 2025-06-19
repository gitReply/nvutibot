const { getOrCreateUser, updateBalance, setBonusBalance } = require('../services/userService');

async function me(req, res) {
  const { telegramId, nickname, avatarUrl } = req.body;
  try {
    const user = await getOrCreateUser(telegramId, nickname, avatarUrl);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function credit(req, res) {
  const { userId, amount } = req.body;
  if (!userId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  try {
    const user = await updateBalance(userId, amount);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function setBonus(req, res) {
  const { userId, amount } = req.body;
  if (!userId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  try {
    const user = await setBonusBalance(userId, amount);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { me, credit, setBonus };
