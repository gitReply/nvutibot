const sequelize = require('../config/database');
const User = require('./user')(sequelize);
const Game = require('./game')(sequelize);
const Referral = require('./referral')(sequelize);
const Notification = require('./notification')(sequelize);
const Settings = require('./settings')(sequelize);

// Ассоциации
User.hasMany(Game, { foreignKey: 'userId' });
Game.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Referral, { foreignKey: 'referrerId' });
Referral.belongsTo(User, { foreignKey: 'referrerId' });

module.exports = {
  sequelize,
  User,
  Game,
  Referral,
  Notification,
  Settings
};
