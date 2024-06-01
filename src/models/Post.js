const { sequelize } = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

class Post extends Model{}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    readNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    votesNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    isPublished: {
        type: DataTypes.BOOLEAN,
        default: false
    },
    headerImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: Sequelize.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false,
    },
}
,{
    sequelize,
    modelName: 'post'
})



module.exports = Post;

