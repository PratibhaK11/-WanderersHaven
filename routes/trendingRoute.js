const express = require('express');
const router = express.Router();
const trendingController = require('../controllers/trendingController');
const middleware = require('../middleware');

// Route for creating a booking
router.post('/booking', middleware.isLoggedIn, trendingController.createBooking);

// Route for fetching trending listings
router.get('/trending', trendingController.getTrendingListings);

module.exports = router;
