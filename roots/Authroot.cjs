const express = require('express');
const router = express.Router();
const { isAuth } = require('../MiddleWares/Auth.cjs');
const AuthController = require('../controllers/AuthController.cjs');
// const userValidation = require('../MiddleWares/Validation/ValidationUser.cjs');
// const validateUserSignIn = require('../MiddleWares/Validation/ValidationUser.cjs');

// router.post('/login', validateUserSignIn, userValidation, AuthController.login);
router.post('/login',  AuthController.login);
router.post('/signup',  AuthController.signup);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/add-favorite', AuthController.addFavorite);
router.get('/favorites/:userId', AuthController.getFavoritesByUser); // Route to update a user
router.delete('/remove-favorite', AuthController.deleteFav); // Route to update a user

module.exports = router;