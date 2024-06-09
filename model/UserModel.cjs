const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  requests: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  otp: {
    type: String,
    required: false
  },
  otp_expiry: {
    type: Date,
    required: false
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication' // Assuming 'Publication' is your model for publications
  }],
});


userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);