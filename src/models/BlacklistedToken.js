const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require("../db/db");

//BlacklistedToken  Model

class BlacklistedToken  extends Model{}

BlacklistedToken .init({
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  tokenExpirationSecondsLeft: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
  },
  {
    sequelize,
    modelName: 'blacklisted_token'
  }

);


module.exports = BlacklistedToken 