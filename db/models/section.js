'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate(models) {
      // define association here
      Section.belongsTo(models.Post, {
        foreignKey: {
          field: 'postId', // Specify the foreign key name in camelCase
          name:'postId',
          allowNull: false, // Ensures a section cannot exist without a post
        },
        onDelete: 'CASCADE', // Deletes associated sections when a post is deleted
        onUpdate: 'CASCADE',
      });
    }
  }

  Section.init({
    content: DataTypes.TEXT,
    title: DataTypes.STRING,
    media: DataTypes.STRING,
    mediaType: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Section',
    tableName: 'sections'
  });

  return Section;
};
