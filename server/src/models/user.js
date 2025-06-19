const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    telegramId: { type: DataTypes.BIGINT, unique: true, allowNull: false },
    nickname: { type: DataTypes.STRING, allowNull: false },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    balance: { type: DataTypes.INTEGER, defaultValue: 0 },
    bonusBalance: { type: DataTypes.INTEGER, defaultValue: 0 },
    referralCode: { type: DataTypes.STRING, unique: true },
    referredBy: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'users',
    timestamps: true
  });
};
