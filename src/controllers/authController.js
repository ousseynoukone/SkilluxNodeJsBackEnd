//AUTH CONTROLLER
const User = require("../models/User");
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 

exports.login = async (req, res)=>{ 
    const errors = validationResult(req);

}

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const user = await  User.create(req.body);

    return res.status(201).json({ success: 'Registration successful', user });
 
  };

exports.resetPasswword = async (req, res)=>{ 

}





