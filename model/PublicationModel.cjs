const mongoose = require('mongoose');
const { Schema } = mongoose;

const publicationSchema = new Schema({
  address: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false, // Set to false since it can be empty
  },
  bathrooms: {
    type: String,
    required: false, // Set to false since it can be empty
  },
  kitchens: {
    type: String,
    required: false, // Set to false since it can be empty
  },
  salon: {
    type: String,
    required: false, // Set to false since it can be empty
  },
  bedrooms: {
    type: String,
    required: false, // Set to false since it can be empty
  },
  price: {
    type: String,
    required: false, // Set to false since it can be empty
  },
  images: {
    type: [String],
    required: false,
  },
  userName:{
    type: String,
    required: false,
  },
  userId:{
    type: String,
    required: false,
  }
});

module.exports = mongoose.model('Publication', publicationSchema);
