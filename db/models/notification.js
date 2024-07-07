'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // A notification belongs to a sender User
      Notification.belongsTo(models.User, {
        as: 'fromUser', // Alias for the association
        foreignKey: {
          field:'fromUserId',
          name:'fromUserId'

        },
        onDelete: 'CASCADE', // Deletes notification if associated user is deleted
        onUpdate: 'CASCADE',
      });

      // A notification belongs to a recipient User
      Notification.belongsTo(models.User, {
        as: 'toUser', // Alias for the association
        foreignKey: {
          field:'toUserId',
          name:'toUserId'

        },
        onDelete: 'CASCADE', // Deletes notification if associated user is deleted
        onUpdate: 'CASCADE',
      });

      // You can add more associations as needed
    }
  }

  Notification.init({
    type: DataTypes.ENUM('like', 'vote', 'comment', 'post', 'follow'),
    isRead:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    ressourceId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications' 

  });

  return Notification;
};
