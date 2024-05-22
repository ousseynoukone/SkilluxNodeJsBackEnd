// Section.js
const { sequelize } = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

class Section extends Model {}

Section.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },

    title:{
        type : DataTypes.STRING,
        allowNull : true
    },

    media :{
        type : DataTypes.STRING,
        allowNull : true
    },

    mediaType :{
        type : DataTypes.STRING,
        allowNull : true
    }


}, {
    sequelize,
    modelName: 'section'
});

module.exports = Section;
