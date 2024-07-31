'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // One-to-Many: Post HAS MANY Comments
      Post.hasMany(models.Comment, {
        foreignKey:'postId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // One-to-Many: Post HAS MANY Moderations
      Post.hasMany(models.Moderation, {
        foreignKey:'postId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Many-to-One: Post BELONGS TO User
      Post.belongsTo(models.User, {
        foreignKey: {
          foreignKey: {
            field:'userId',
            name:'userId'

          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      });
    }
  }

  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    readNumber: DataTypes.INTEGER,
    votesNumber: DataTypes.INTEGER,
    isPublished:{
      type:DataTypes.BOOLEAN,
      defaultValue:true
    },
    headerImage: DataTypes.STRING,
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Define tags as an array of strings
      allowNull: true,
    },


  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts' 
  });

  return Post;
};
