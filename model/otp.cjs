const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new mongoose.Schema({
    // existing fields...
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      required: false
    },
    otp_expiry: {
      type: Date,
      required: false
    }
  });

  
module.exports = mongoose.model('Otp', OtpSchema);