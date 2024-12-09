const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { getAllVendors } = require('../controllers/vendorsrController');
const router = express.Router();

// Route to fetch all vendors
router.get('/', authenticate, getAllVendors);

module.exports = router;
