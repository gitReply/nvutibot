const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  return sequelize.define('Settings', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    payoutPercent: { type: DataTypes.INTEGER, defaultValue: 95 },
    referralPercent: { type: DataTypes.INTEGER, defaultValue: 5 },
    maxStars: { type: DataTypes.INTEGER, defaultValue: 6 },
    autoPayout: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'settings',
    timestamps: false
  });
};
