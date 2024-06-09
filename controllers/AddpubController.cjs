const Publication = require("../model/PublicationModel.cjs");

// Update your addPublication controller to handle missing fields and respond with appropriate error message

exports.addPublication = async (req, res) => {
  try {
      const { address, type, description, bathrooms, kitchens, salon, bedrooms, price, userName, userId } = req.body;

      // Check if all required fields are provided
      if (!address || !type || !description || bathrooms == null || kitchens == null || salon == null || bedrooms == null || !price || !userId || !userName) {
          return res.status(400).json({ message: 'All required fields must be provided' });
      }

      // Process image paths to use forward slashes
      const images = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];

      // Create and save the new publication
      const newPublication = new Publication({
          userId,
          userName,
          address,
          type,
          description,
          bathrooms,
          kitchens,
          salon,
          bedrooms,
          price,
          images,
      });
      await newPublication.save();

      // Respond with the newly created publication's ID
      res.status(201).json({ message: 'Publication created successfully!', publicationId: newPublication._id });
  } catch (error) {
      console.error('Error adding publication:', error);
      res.status(500).json({ message: 'Error while adding publication!' });
  }
};





exports.getPublication = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using user authentication middleware

    // Fetch publication data based on user ID or any other criteria
    const publications = await Publication.find({ userId }); // Adjust this query based on your database schema

    if (!publications || publications.length === 0) {
      console.error('Publications not found for user ID:', userId);
      return res.status(404).json({ error: 'Publications not found' });
    }

    console.log('Publications retrieved successfully for user ID:', userId);
    res.json(publications);
  } catch (err) {
    console.error('Error fetching publications:', err.message);
    res.status(500).send('Server Error');
  }
};
const mongoose = require('mongoose');

exports.getPublicationById = async (req, res) => {
  try {
    const publicationId = req.params.id; // Get the publication ID from the request parameters
    console.log("Publication ID:", publicationId);

    // const userId = req.user.id; // Assuming you're using user authentication middleware
    const objectId = new mongoose.Types.ObjectId(publicationId);
    // Ensure publicationId is in the correct format if needed
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({ error: 'Invalid publication ID' });
    }

    // Convert string to ObjectId
    console.log("ObjectId:", objectId);
    // Fetch the publication data based on publication ID and user ID
    const publication = await Publication.findOne({ _id: objectId}); // Adjust this query based on your database schema

    if (!publication) {
      console.error('Publication not found for publication ID:', publicationId);
      return res.status(404).json({ error: 'Publication not found' });
    }

    console.log('Publication retrieved successfully for publication ID:', publication);
    return res.json(publication);
  } catch (err) {
    console.error('Error fetching publication:', err.message);
    res.status(500).send('Server Error');
  }
};
exports.AllgetPublication = async (req, res) => {
  try {
      const publications = await Publication.find();
      
      // Check if no publications are found
      if (!publications || publications.length === 0) {
          return res.status(404).json({ message: 'No publications found' });
      }

      // Send the publications array
      res.json(publications);
  } catch (error) {
      console.error('Error fetching publications:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};


exports.handleUpload = async (files, data) => {
  try {
    // Process uploaded files and data
    console.log('Uploaded files:', files);
    console.log('Additional data:', data);

    // Example: save files to database or file system
    const filePaths = files.map(file => file.path);

    // Return a response or perform other actions as needed
    return { message: 'Upload successful', files: filePaths };
  } catch (error) {
    console.error('Error handling upload:', error);
    throw new Error('Failed to handle upload');
  }
};

exports.updatePublication = async (req, res) => {
  try {
    const publicationId = req.params.id;
    const { address, type, description, bathrooms, kitchens, salon, bedrooms, price, userName, userId } = req.body;

    // Validate if all required fields are present
    if (!address || !type || !description || !bathrooms || !kitchens || !salon || !bedrooms || !price) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    // Find the publication by ID
    let publication = await Publication.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    // Update publication fields
    publication = {
      ...publication._doc,
      userId,
      userName,
      address,
      type,
      description,
      bathrooms,
      kitchens,
      salon,
      bedrooms,
      price,
      images: images.length > 0 ? images : publication.images // Keep existing images if no new ones are provided
    };

    // Save the updated publication
    await Publication.findByIdAndUpdate(publicationId, publication);

    return res.status(200).json({ message: 'Publication updated successfully', publicationId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while updating publication' });
  }
};
exports.deletePublication = async (req, res) => {
  try {
    const publicationId = req.params.id;

    // Find the publication by ID and delete it
    const publication = await Publication.findByIdAndDelete(publicationId);

    if (!publication) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    return res.status(200).json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while deleting publication' });
  }
};
