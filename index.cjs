// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const path = require('path');
// const isAuth = require('./MiddleWares/authMiddleware.cjs');

// const app = express();
// const PORT = process.env.PORT || 4000;
// const MONGODB_URI = process.env.MONGODB_URI;

// // Middleware for JSON parsing
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(MONGODB_URI);

// mongoose.connection.on('connected', () => {
//   console.log('Connected to MongoDB');
// });

// // Construct the absolute path to controllers
// const AuthControllerPath = path.join(
//   __dirname,
//   'controllers',
//   'AuthController.cjs',
// );
// const ProfileControllerPath = path.join(
//   __dirname,
//   'controllers',
//   'ProfileController.cjs',
// );
// const AddpubControllerPath = path.join(
//   __dirname,
//   'controllers',
//   'AddpubController.cjs',
// );

// const AuthController = require(AuthControllerPath);
// const ProfileController = require(ProfileControllerPath);
// const AddpubController = require(AddpubControllerPath);

// // Define the routes
// app.post('/login', AuthController.login);
// app.post('/signup', AuthController.signup);
// app.get('/profile', isAuth, ProfileController.getProfile); // Apply isAuth middleware to the profile route
// app.put('/profile/update', isAuth, ProfileController.updateProfile); // Add route for updating profile
// app.post('/addpublication', AddpubController.addPublication);
// app.get('/getPublication', AddpubController.getPublication);

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
