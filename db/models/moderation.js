'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Moderation extends Model {
    static associate(models) {
      Moderation.belongsTo(models.User, {
        foreignKey: {
          field: 'userId',
          name:'userId'

        }
      });

      Moderation.belongsTo(models.Post, {
        foreignKey: {
          field: 'postId',
          name:'postId'

        }
      });
    }
  }

  Moderation.init({
    motif: DataTypes.STRING,
    decision: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Moderation',
    tableName: 'moderations'
  });

  return Moderation;
};