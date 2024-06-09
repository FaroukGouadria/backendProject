const express = require('express');
const multer = require('multer');
const addpubController = require('../controllers/AddpubController.cjs');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');  // Ensure this directory exists or multer will throw an error
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create a router object from express
const router = express.Router();

// Define the route for adding publications
router.post('/addpublication', upload.array('photos'), addpubController.addPublication);
router.get('/publication',addpubController.getPublication)
router.get('/publication/:id', addpubController.getPublicationById); // Add this line for fetching publication by ID
router.get('/publications', addpubController.AllgetPublication);
router.put('/update/:id', upload.array('photos'), addpubController.updatePublication);
router.delete('/delete/:id', addpubController.deletePublication);

// Export the router for use in your main app file
module.exports = router;
