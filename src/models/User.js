const { sequelize } = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');


class User extends Model{}

User.init({
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    fullName : {
        type : DataTypes.STRING,
        allowNull : false
    },
    username : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    profession : {
        type : DataTypes.STRING,
        allowNull : true
    },
    isAdmin : {
        type : DataTypes.BOOLEAN,
        defaultValue:false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    birth : {
        type : DataTypes.DATEONLY,
        allowNull : false,
        unique : false

    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    profilePicture : {
        type : DataTypes.STRING,
        allowNull : true
    },
    preferredTags: {
        type: Sequelize.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
    },
    
},
{
    sequelize,
    modelName: 'user'
}) 

module.exports = User

