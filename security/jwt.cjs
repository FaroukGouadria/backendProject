const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Load JWT secret from environment variable

// Function to generate JWT token
const generateToken = userId => {
  return jwt.sign({userId}, JWT_SECRET, {expiresIn: '3h'});
};

// Function to verify JWT token
const verifyToken = token => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId; // Extract userId from decoded token
  } catch (error) {
    // Token verification failed
    return null;
  }
};

module.exports = {generateToken, verifyToken};
