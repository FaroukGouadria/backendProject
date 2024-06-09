// UserRouter.cjs

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController.cjs');
const { validateUserSignUp,userValidation } = require('../MiddleWares/Validation/ValidationUser.cjs');
const {validateUserSignIn} = require('../MiddleWares/Validation/ValidationUser.cjs');

router.post('/register', validateUserSignUp, userValidation, UserController.register);
router.post('/login',validateUserSignIn, userValidation, UserController.login);

router.get('/getusers', UserController.getAllUsers); // Route to get all users
router.delete('/users/delete/:id', UserController.deleteUser); // Route to delete a user
router.put('/users/update/:id', UserController.updateUser); // Route to update a user

module.exports = router;

