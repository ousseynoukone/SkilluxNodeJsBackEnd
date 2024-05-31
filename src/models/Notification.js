const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require("../db/db");

//Notification Model

class Notification extends Model{}

Notification.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['vote','comment','follow','post'],
      allowNull : false
    },
    isRead: {
        type:DataTypes.BOOLEAN,
        defaultValue : false
    },
    ressourceId : {
        type:DataTypes.INTEGER,
        allowNull : false
    }

  },
  {
    sequelize,
    modelName: 'notification'
  }


);


module.exports = Notification