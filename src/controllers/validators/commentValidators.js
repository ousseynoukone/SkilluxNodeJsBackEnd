const { body, validationResult } = require('express-validator');

exports.commentAddingValidator = [
  body('postId')
    .notEmpty().withMessage('Post ID is required')
    .isInt().withMessage('Post ID must be an integer'),

  body('parentId')
    .optional()
    .isInt().withMessage('Parent ID must be an integer'),

  body('text')
    .notEmpty().withMessage('Text is required')
    .isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),

  body('isModified')
    .optional()
    .isBoolean().withMessage('isModified must be a Boolean'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

exports.commentUpdateValidator = [
  body('postId')
    .notEmpty().withMessage('Post ID is required')
    .isInt().withMessage('Post ID must be an integer'),

  body('parentID')
    .optional()
    .isInt().withMessage('Parent ID must be an integer'),

  body('text')
    .notEmpty().withMessage('Text is required')
    .isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),

  body('isModified')
    .optional()
    .isBoolean().withMessage('isModified must be a Boolean'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
