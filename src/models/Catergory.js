// Category.js
const { sequelize } = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

class Category extends Model {}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },


}, {
    sequelize,
    modelName: 'category'
});

module.exports = Category;
