const User = require('../model/UserModel.cjs');

exports.getProfile = async (req, res) => {
  try {
    console.log('Authenticated user:', req.body);
    const {id}=req.body

    // if (!req.user || !req.user.id) {
    //   return res.status(401).json({error: 'Authentication failed'});
    // }

    // const id = req.body.id;
    const user = await User.findById(id).select('-password'); // Exclude password field

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('Received update request:', req.body); // Log the received request body
    console.log('User ID:', req.user.id); // Log the extracted user ID

    const userId = req.user.id;
    const {fullname, email, address} = req.body;

    // Validate that required fields are not empty
    if (!fullname || !email || !address) {
      return res
        .status(400)
        .json({error: 'Full name, email, and address are required'});
    }

    // Check if the new email is already in use by another user
    const existingUser = await User.findOne({email});
    if (existingUser && existingUser.id !== userId) {
      return res
        .status(400)
        .json({error: 'Email already in use by another user'});
    }

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {fullname, email, address},
      {new: true}, // Return the updated user object
    ).select('-password'); // Exclude password field from the response

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Server Error');
  }
};
