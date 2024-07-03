'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Moderation extends Model {
    static associate(models) {
      // A moderation belongs to a single User (moderator)
      Moderation.belongsTo(models.User, {
        foreignKey: {
          field: 'userId', // Specify the foreign key name in camelCase
          allowNull: false, // Ensures a moderation cannot exist without a user
        },
        onDelete: 'CASCADE', // Deletes moderation if associated user is deleted
        onUpdate: 'CASCADE',
      });

      // A moderation belongs to a single Post
      Moderation.belongsTo(models.Post, {
        foreignKey: {
          field: 'postId', // Specify the foreign key name in camelCase
          allowNull: false, // Ensures a moderation cannot exist without a post
        },
        onDelete: 'CASCADE', // Deletes moderation if associated post is deleted
        onUpdate: 'CASCADE',
      });
    }
  }

  Moderation.init({
    motif: DataTypes.STRING,
    decision: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Moderation',
    tableName: 'moderations'
  });

  return Moderation;
};
