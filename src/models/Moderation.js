const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require("../db/db");

//Moderation Model

class Moderation extends Model{}

Moderation.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    motif: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'moderation'
  }


);


module.exports = Moderation