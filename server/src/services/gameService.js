const { Game, Settings } = require('../models/init');
const { getHash, deriveResult } = require('../utils/fair');

async function createGame({ userId, clientSeed, serverSeed, nonce, wager }) {
  const serverSeedHash = require('crypto')
    .createHash('sha256')
    .update(serverSeed)
    .digest('hex');

  const settings = await Settings.findOne();
  const maxStars = settings.maxStars;
  const payoutPercent = settings.payoutPercent;

  const hash = getHash(serverSeed, clientSeed, nonce);
  const result = deriveResult(hash, maxStars);

  // Простая nvuti логика: выигрыш если число чётное
  const won = result % 2 === 0 ? Math.floor(wager * (payoutPercent / 100)) : 0;

  const game = await Game.create({
    userId,
    clientSeed,
    serverSeedHash,
    serverSeed,
    nonce,
    result,
    wager,
    won
  });

  return { game, result, won };
}

module.exports = {
  createGame
};
