const { body, validationResult } = require('express-validator');

exports.updateUserTagsPreferencesValidator = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('UserID must be an integer'),

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

exports.updateUserTagsPreferencesUpdateValidator = [
  body('userId')
    .optional()
    .isInt().withMessage('User ID must be an integer'),

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
