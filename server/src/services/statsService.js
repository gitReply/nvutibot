const { User, Game } = require('../models/init');
const { sequelize } = require('../models/init');
const { QueryTypes } = require('sequelize');

async function getStats() {
  const usersCount = await User.count();
  const gamesCount = await Game.count();
  const totalBalance = await User.sum('balance');
  const gamesPerDay = await sequelize.query(
    `SELECT date(created_at) AS date, count(*) AS count
     FROM games GROUP BY date ORDER BY date DESC LIMIT 30;`,
    { type: QueryTypes.SELECT }
  );
  return { usersCount, gamesCount, totalBalance, gamesPerDay };
}

module.exports = { getStats };
