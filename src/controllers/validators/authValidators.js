const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .isLowercase().withMessage('Email should be all lowercase'),

  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters')
    .isLowercase().withMessage('Username should be all lowercase')
    .custom(value => {
      if (/\s/.test(value)) {
        throw new Error('Username should not contain spaces');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_+=]{8,}$/, 'i')
    .withMessage('Password must contain at least one letter, one lowercase letter, and one number'),

  body('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),

  body('birth')
    .notEmpty().withMessage('Birth day is required')
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Birth day must be a date'),

  body('fullName')
    .notEmpty().withMessage('Fullname is required')
    .isLength({ max: 50 }).withMessage('Full Name must be between 1 and 50 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed to the next middleware or controller function
  }
];

exports.validateLogin = [
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed to the next middleware or controller function
  }
];
