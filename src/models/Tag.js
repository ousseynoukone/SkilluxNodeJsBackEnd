// Tag.js
const { sequelize } = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

class Tag extends Model {}

Tag.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false
    },


}, {
    sequelize,
    modelName: 'tag'
});

module.exports = Tag;
