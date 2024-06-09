const bcrypt = require('bcryptjs');
const User = require('../model/UserModel.cjs');

exports.register = async (req, res) => {
  try {
    const {fullname, address, email, password} = req.body;

    // Check if email is already in use
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email déjà utilisé !'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullname,
      address,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({message: 'User created successfully'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Internal server problem'});
  }
};

const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server problem' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server problem' });
  }
};


// New function to delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server problem' });
  }
};

// New function to update a user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullname, address, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullname = fullname || user.fullname;
    user.address = address || user.address;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server problem' });
  }
};
