const { body, validationResult } = require('express-validator');

exports.tagAddingValidator = [
  body('libelle')
    .notEmpty().withMessage('Libelle is required')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Libelle must be between 1 and 255 characters')
    .isString().withMessage('Libelle must be a string'),

  body('score')
    .optional()
    .isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

exports.tagUpdatingValidator = [
  body('libelle')
    .optional()
    .isLength({ min: 1, max: 255 }).withMessage('Libelle must be between 1 and 255 characters')
    .isString().withMessage('Libelle must be a string'),

  body('score')
    .optional()
    .isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
