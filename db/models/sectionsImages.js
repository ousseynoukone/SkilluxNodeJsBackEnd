'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SectionImage extends Model {
    static associate(models) {

    }
  }

  SectionImage.init({
    url: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'SectionImage',
    tableName: 'sections-images'
  });

  return SectionImage;
};
