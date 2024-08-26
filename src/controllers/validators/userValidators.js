const { body, validationResult } = require('express-validator');

exports.updateUserTagsPreferencesValidator = [


  body('tags')
    .notEmpty().withMessage('Tags array is required')
    .isArray().withMessage('Tags should be an array'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];




exports.updateUserValidator = [
  body('fullName')
    .optional()
    .isString().withMessage('Full Name must be a string')
    .isLength({ min: 1 }).withMessage('Full Name cannot be empty'),


  body('email')
    .optional()
    .isEmail().withMessage('Email must be a valid email address'),

    body('profession')
    .optional()
    .isLength({ min: 1 }).withMessage('profession Name cannot be empty'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
