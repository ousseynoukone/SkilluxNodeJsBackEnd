const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:passer@localhost:5432/skillux_db');

module.exports = { sequelize };