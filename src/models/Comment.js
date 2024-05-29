const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require("../db/db");

//Comment Model

class Comment extends Model{}

Comment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },

    isModified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    like : {
      type:DataTypes.INTEGER,
      defaultValue : 0
    }
  },
  {
    sequelize,
    modelName: 'comment'
  }

);


module.exports = Comment