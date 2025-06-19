const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  return sequelize.define('Game', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    clientSeed: { type: DataTypes.STRING, allowNull: false },
    serverSeedHash: { type: DataTypes.STRING, allowNull: false },
    serverSeed: { type: DataTypes.STRING, allowNull: false },
    nonce: { type: DataTypes.BIGINT, allowNull: false },
    result: { type: DataTypes.INTEGER, allowNull: false },
    wager: { type: DataTypes.INTEGER, allowNull: false },
    won: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: 'games',
    timestamps: true
  });
};
