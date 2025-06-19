const crypto = require('crypto');

function generateServerSeed() {
  return crypto.randomBytes(32).toString('hex');
}

function getHash(serverSeed, clientSeed, nonce) {
  // nonce может быть любым числом (например, ID игры или timestamp)
  return crypto
    .createHash('sha256')
    .update(`${serverSeed}:${clientSeed}:${nonce}`)
    .digest('hex');
}

function deriveResult(hash, maxStars) {
  // берём первые 8 символов хэша как число
  const num = parseInt(hash.slice(0, 8), 16);
  // результат от 1 до maxStars включительно
  return (num % maxStars) + 1;
}

module.exports = {
  generateServerSeed,
  getHash,
  deriveResult
};
