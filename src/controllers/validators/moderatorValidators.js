const { body, validationResult } = require('express-validator');

exports.moderationValidator = [
  body('motif')
    .notEmpty().withMessage('Motif is required')
    .isString().withMessage('Motif should be a string'),

  body('decision')
    .optional()
    .isBoolean().withMessage('Decision should be a boolean'),


  body('postId')
    .notEmpty().withMessage('Post ID is required')
    .isInt().withMessage('Post ID must be an integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
