const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

const UserFollowing = sequelize.define('user_followings', {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true
}
);

module.exports = UserFollowing;
