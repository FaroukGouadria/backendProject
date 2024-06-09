// Assuming you have an Express router set up in your backend

const express = require('express');
const router = express.Router();
const Publication = require('../model/PublicationModel.cjs'); // Assuming you have a Publication model

router.get('/getPublication', async (req, res) => {
  try {
    // Add console log to track when the endpoint is accessed
    console.log('GET /getPublication endpoint accessed');

    // Query the database for publications
    const publications = await Publication.find();

    // Add console log to display fetched publications
    console.log('Fetched publications:', publications);

    // Send the publications as JSON response
    res.json(publications);
  } catch (error) {
    // Log any errors that occur during fetching publications
    console.error('Error fetching publications:', error);
    res.status(500).json({error: 'Failed to fetch publications'});
  }
});

module.exports = router;
