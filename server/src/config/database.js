const { Sequelize } = require('sequelize');
const { databaseUrl } = require('./settings');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true
  }
});

module.exports = sequelize;
