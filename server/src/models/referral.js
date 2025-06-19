const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  return sequelize.define('Referral', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true, allowNull: false },
    referrerId: { type: DataTypes.INTEGER, allowNull: false },
    bonusAmount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isCustom: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'referrals',
    timestamps: true
  });
};
