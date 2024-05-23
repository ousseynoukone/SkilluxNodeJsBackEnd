//AUTH CONTROLLER
const User = require("../models/User");
const LoginDto =  require("../models/dtos/loginDto")
const { validationResult } = require('express-validator');
const isOldEnough = require("./validators/helper")
const bcrypt = require('bcrypt');
const getUserResponse = require("../models/dtos/userLoginResponseDto")
const jwt = require('jsonwebtoken');
const { where } = require("sequelize");
require('dotenv').config(); // Load environment variables from .env file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// Function to generate access token
function generateAccessToken(username) {
  return jwt.sign({ username }, accessTokenSecret, { expiresIn: '15m' });
}

// Function to generate refresh token
function generateRefreshToken(username) {
  return jwt.sign({ username }, refreshTokenSecret, { expiresIn: '7d' });
}



exports.login = async (req, res)=>{ 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const loginDto = LoginDto.fromBody(req.body);
    if(!loginDto.username && !loginDto.email){
      return res.status(401).json({ error: 'At least one among username and email should be provided'});
    }

    let user;
    if (loginDto.username) {
        user = await User.findOne({ where: { username: loginDto.username } });
    } else if (loginDto.email) {
        user = await User.findOne({ where: { email: loginDto.email } });
    }

    if(!user){
      return res.status(401).json({ error: 'Do not exist in our records'});
    }
    console.log(user.toJSON())
    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Login or/and Password incorrect' });
    }

    const token = generateAccessToken(user.username)
    const userResponse = getUserResponse(user)

    return res.status(200).json({ success: 'Login successful', user :userResponse,token:token } );

    } 
  catch (error) {
    console.log(error)

     res.status(500).json({ error: 'Login failed' });
  }

}






exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      let birth = req.body.birth

      if(!isOldEnough(birth)){
        return res.status(400).json({ error: 'Age does not met the minimum requirement.'});
      }
        const user = await  User.create(req.body);
        return res.status(201).json({ success: 'Registration successful', user });

      } 
    catch (error) {
       res.status(500).json({ error: 'Registration failed' });
    }

  };




exports.resetPasswword = async (req, res)=>{ 

}





