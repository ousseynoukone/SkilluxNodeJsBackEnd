// Validator
const { body } = require('express-validator');


const userRegisterValidator = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('username').notEmpty().withMessage('Username is required').isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'i')
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),
  body('birth').isDate({format:"YYYY-MM-DD"}).withMessage('Birth day  must be a date'),
  body('birth').notEmpty().withMessage('Birth\'s day is required'),
  body('fullName').notEmpty().withMessage('Fullname is required').isLength({ max: 50 }).withMessage('Full Name must be between 1 and 50 characters'),

];

const userLoginValidator = [
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];


const postAddingValidator = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('UserID must be an integer'),
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),
    
    
  body('viewNumber')
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
    .isArray().withMessage('Tags should be an array')
]






const postUpdateValidator = [
  body('userId')
    .optional()
    .isInt().withMessage('User ID must be an integer'),

  body('title')
    .optional()
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),

  // body('categoryId')
  //   .optional() 
  //   .isInt().withMessage('Category must be an integer'),

    
  body('viewNumber')
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
    .isArray().withMessage('Tags should be an array')
]





const updateUserTagsPreferencesValidator = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('UserID must be an integer'),
  body('tags')
    .notEmpty().withMessage('Tags array is required')
    .isArray().withMessage('Tags should be an array')
    
  ]


const categoryAddingValidator = [
  body('category')
    .notEmpty().withMessage('Category is required')
    .isLength({ min: 1, max: 255 }).withMessage('Category must be between 1 and 255 characters')
];




const categoryUpdateValidator = [
  body('category')
    .optional()
    .isLength({ min: 1, max: 255 }).withMessage('Category must be between 1 and 255 characters')
];


const sectionAddingValidator = [
  // body('postId')
  // .notEmpty().withMessage('Post ID is required')
  // .isInt().withMessage('Post ID must be an integer'),

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
];


const sectionUpdateValidator = [
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
];



const commentAddingValidator = [
  body('postId')
  .notEmpty().withMessage('Poste ID is required')
  .isInt().withMessage('Post ID must be an integer'),



  body('parentID')
  .optional()
  .isInt().withMessage('User ID must be an integer'),

  body('text')
      .notEmpty().withMessage('Text is required')
      .isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),

  body('isModified')
      .optional()
      .isBoolean().withMessage('isModified must be an Boolean'),

];

const commentUpdateValidator = [
  body('postId')
  .notEmpty().withMessage('Poste ID is required')
  .isInt().withMessage('Post ID must be an integer'),



  body('parentID')
  .optional()
  .isInt().withMessage('User ID must be an integer'),

  body('text')
      .notEmpty().withMessage('Text is required')
      .isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),

  body('isModified')
      .optional()
      .isBoolean().withMessage('isModified must be an Boolean'),

];





const moderationValidator = [
  body('motif').notEmpty().withMessage('Motif is required').isString().withMessage('Motif should be string'),
  body('decision').optional().isBoolean().withMessage('Decision should be boolean'),
  body('userId').notEmpty().withMessage('User ID is required').isInt().withMessage('User ID must be an integer'),
  body('postId').notEmpty().withMessage('Post ID is required').isInt().withMessage('Post ID must be an integer')
];





module.exports = { userRegisterValidator, userLoginValidator,postAddingValidator,
  categoryAddingValidator,postUpdateValidator ,categoryUpdateValidator,sectionAddingValidator,
  sectionUpdateValidator,commentAddingValidator,commentUpdateValidator,moderationValidator,
  updateUserTagsPreferencesValidator

};


