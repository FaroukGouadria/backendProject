const {check, validationResult} = require('express-validator');

exports.validateUserSignUp = [
  check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required!')
    .isString()
    .withMessage('Must be a valid name!')
    .isLength({min: 3, max: 20})
    .withMessage('Name must be 3 to 20 characters long!'),
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email format!'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required!')
    .isLength({min: 8, max: 10})
    .withMessage('Password must be 8 to 10 characters long!'),
];

exports.userValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({success: false, message: error});
  }
  next();
};

exports.validateUserSignIn = [
  check('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format!')
    .not()
    .isEmpty()
    .withMessage('Email is required!'),
  check('password').trim().not().isEmpty().withMessage('Password is required!'),
];
