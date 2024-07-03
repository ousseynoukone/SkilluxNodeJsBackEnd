const { body, validationResult } = require('express-validator');

exports.sectionAddingValidator = [
  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),

  body('title')
    .optional()
    .isLength({ max: 255 }).withMessage('Title must be up to 255 characters'),

  body('media')
    .optional()
    .isLength({ max: 255 }).withMessage('Media must be up to 255 characters'),

  body('mediaType')
    .optional()
    .isLength({ max: 50 }).withMessage('Media type must be up to 50 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

exports.sectionUpdateValidator = [
  body('postId')
    .optional()
    .isInt().withMessage('Post ID must be an integer'),

  body('content')
    .optional()
    .isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),

  body('title')
    .optional()
    .isLength({ max: 255 }).withMessage('Title must be up to 255 characters'),

  body('media')
    .optional()
    .isLength({ max: 255 }).withMessage('Media must be up to 255 characters'),

  body('mediaType')
    .optional()
    .isLength({ max: 50 }).withMessage('Media type must be up to 50 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
