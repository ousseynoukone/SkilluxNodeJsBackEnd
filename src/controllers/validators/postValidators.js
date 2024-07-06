const { body, validationResult } = require('express-validator');

exports.postAddingValidator = [

  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),

  body('readNumber')
    .optional()
    .isInt({ min: 0 }).withMessage('View Number must be a non-negative integer'),

  body('votesNumber')
    .optional()
    .isInt({ min: 0 }).withMessage('Votes Number must be a non-negative integer'),

  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be a boolean'),

  body('headerImage')
    .notEmpty().withMessage('Header Image is required')
    .isString().withMessage('Header Image must be a string'),

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

exports.postUpdateValidator = [

  body('title')
    .optional()
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),

  body('readNumber')
    .optional()
    .isInt({ min: 0 }).withMessage('View Number must be a non-negative integer'),

  body('votesNumber')
    .optional()
    .isInt({ min: 0 }).withMessage('Votes Number must be a non-negative integer'),

  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be a boolean'),

  body('headerImage')
    .optional()
    .isString().withMessage('Header Image must be a string'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags should be an array'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
