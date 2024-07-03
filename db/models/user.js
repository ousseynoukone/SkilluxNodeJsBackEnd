'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // One-to-Many: User HAS MANY Posts
      User.hasMany(models.Post, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // One-to-Many: User HAS MANY Comments
      User.hasMany(models.Comment, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // One-to-Many: User HAS MANY Moderations
      User.hasMany(models.Moderation, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Many-to-Many: User BELONGS TO MANY Tags
      User.belongsToMany(models.Tag, {
        through: 'user_tag',
        foreignKey: 'userId', // Specify the foreign key name in camelCase
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Many-to-Many: User CAN FOLLOW MANY Users
      User.belongsToMany(models.User, {
        through: 'user_followings',
        as: 'following',
        foreignKey: 'followerId', // Specify the foreign key name in camelCase
        otherKey: 'followingId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Many-to-Many: User CAN BE FOLLOWED BY MANY Users
      User.belongsToMany(models.User, {
        through: 'user_followings',
        as: 'followers',
        foreignKey: 'followingId', // Specify the foreign key name in camelCase
        otherKey: 'followerId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // One-to-Many: User HAS MANY SentNotifications
      User.hasMany(models.Notification, {
        foreignKey: 'fromUserId',
        as: 'sentNotifications',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // One-to-Many: User HAS MANY ReceivedNotifications
      User.hasMany(models.Notification, {
        foreignKey: 'toUserId',
        as: 'receivedNotifications',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // One-to-Many: User HAS MANY BlacklistedTokens
      User.hasMany(models.BlacklistedToken, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: 'userId',

      });
    }
  }

  User.init({
    fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    profession: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    lang: DataTypes.STRING,
    birth: DataTypes.DATE,
    password: DataTypes.STRING,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

  return User;
};
