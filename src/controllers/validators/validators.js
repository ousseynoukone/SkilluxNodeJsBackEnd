// Validator
const { body } = require('express-validator');


const userRegisterValidator = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('username').notEmpty().withMessage('Username is required').isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$/, 'i')
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),
  body('birth').isDate({format:"YYYY-MM-DD"}).withMessage('Birth day  must be a date'),
  body('birth').notEmpty().withMessage('Birth\'s day is required'),
  body('fullName').notEmpty().withMessage('Fullname is required').isLength({ max: 50 }).withMessage('Full Name must be between 1 and 50 characters'),

];

const userLoginValidator = [
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

module.exports = { userRegisterValidator, userLoginValidator };


