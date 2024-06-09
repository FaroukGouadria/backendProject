const User = require('../model/UserModel.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const {fullname, address, email, password} = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already exists!'});
    }

    // Create a new user
    const newUser = new User({fullname, address, email, password});
    await newUser.save();

    res.status(201).json({message: 'User created successfully!'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Error while signing up!'});
  }
};

exports.login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.json({token});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
