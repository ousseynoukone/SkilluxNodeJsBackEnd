const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env file
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;

const sequelize = new Sequelize(`postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`, {
  dialect: 'postgres',
  logging: false, // Enable logging; default: console.log
});

module.exports = { sequelize };