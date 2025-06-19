const { createGame } = require('../services/gameService');

async function play(req, res) {
  const { telegramId, clientSeed, serverSeed, nonce, wager } = req.body;
  if (!telegramId || !clientSeed || !serverSeed || !nonce || !wager) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  try {
    const result = await createGame({ telegramId, clientSeed, serverSeed, nonce, wager });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { play };
