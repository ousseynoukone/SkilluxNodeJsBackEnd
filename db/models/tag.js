'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Many-to-Many: Tag BELONGS TO MANY Users
      Tag.belongsToMany(models.User, {
        through: 'user_tag', // Assuming this is the junction table name
        foreignKey: 'tagId', // Specify the foreign key name in camelCase
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Tag.init({
    libelle: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags' // Corrected table name to 'tags' based on the model's purpose
  });

  return Tag;
};
