const jwt = require('jsonwebtoken');
const User = require('../model/UserModel.cjs'); // Assuming UserModel.js is in the correct location without the .cjs extension
const {JWT_SECRET} = process.env;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({error: 'Authorization token is missing'});
  }

  try {
    const token = authHeader.split(' ')[1]; // Extract token without 'Bearer '

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.user || !decoded.user.userId) {
      return res.status(401).json({error: 'Invalid token payload'});
    }

    const {userId} = decoded.user;
    req.user = {id: userId};
    console.log('Decoded user ID:', userId);
    console.log('Request user ID:', req.user.id);

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({error: 'Token expired'});
    }
    console.error('Token verification failed:', err);
    res.status(401).json({error: 'Invalid token'});
  }
};

module.exports = authMiddleware;
