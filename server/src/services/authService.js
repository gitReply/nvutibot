const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/init');
const { jwtSecret } = require('../config/settings');

async function login(username, password) {
  // в нашем случае простая аутентификация по заранее созданному админ‑пользователю
  const user = await User.findOne({ where: { nickname: username, isAdmin: true } });
  if (!user) throw new Error('User not found');
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid credentials');
  const token = jwt.sign({ userId: user.id, isAdmin: true }, jwtSecret, { expiresIn: '8h' });
  return token;
}

module.exports = { login };
