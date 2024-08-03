require('dotenv').config(); // Load environment variables from .env file
const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;

module.exports = {
  "development": {
    "username": DATABASE_USERNAME,
    "password": DATABASE_PASSWORD,
    "database": DATABASE_NAME,
    "host": DATABASE_HOST,
    "port": DATABASE_PORT,
    "dialect": "postgres",
    "logging": false // Disable SQL query logging
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false // Disable SQL query logging
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false // Disable SQL query logging
  }
}
