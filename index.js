const express = require('express');
const { validationResult } = require('express-validator');

const { sequelize } = require("./src/db/db");
const applyRelationShip = require("./src/db/applyRelationShip")
const {login,register,resetPasswword} = require("./src/controllers/authController")
const { userRegisterValidator, userLoginValidator } = require('./src/controllers/validators/validators');


const app = express();
const PORT = process.env.PORT || 5050;

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body for html post form
// app.use(express.urlencoded({ extended: true }));


app.listen(PORT, async () => {
  console.log("Server running on port "+PORT);
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    applyRelationShip()
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});






// ENDPOINTS

// AUTH ENDPOINTS
app.post("/api/v1/auth/login", userLoginValidator, login);
app.post("/api/v1/auth/register", userRegisterValidator, register);
app.post("/api/v1/auth/reset-password", resetPasswword);



