'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // A comment belongs to a single User
      Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false, // Ensures a comment cannot exist without a user
          name:'userId',
          field: 'userId', // Renamed foreign key field to camelCase
        },
        onDelete: 'CASCADE', // Deletes comment if associated user is deleted
        onUpdate: 'CASCADE',
      });

      // A comment belongs to a single Post
      Comment.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false, // Ensures a comment cannot exist without a post
          name:'postId',
          field: 'postId', // Renamed foreign key field to camelCase
        },
        onDelete: 'CASCADE', // Deletes comment if associated post is deleted
        onUpdate: 'CASCADE',
      });

      // A comment can have many child comments
      Comment.hasMany(models.Comment, {
        as: 'childComments', // Alias for accessing child comments
        foreignKey: {
          field:'parentId',
          name:'parentId'
          
        }, // Foreign key in the child comment table
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // A comment belongs to a single parent comment (self-referencing)
      Comment.belongsTo(models.Comment, {
        as: 'parentComment', // Alias for accessing parent comment
        foreignKey: {
          field:'parentId',
          name:'parentId'

        }, // Foreign key in the comment table
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

    }
  }

  Comment.init({
    text: DataTypes.TEXT,
    isModified: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
    } ,
    like:{
      type : DataTypes.INTEGER,
      defaultValue:0
    } 
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments' 

  });

  return Comment;
};
