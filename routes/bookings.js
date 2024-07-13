const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const bookingsController = require('../controllers/bookingsController');

// GET route to show booking form
router.get('/', middleware.isLoggedIn, bookingsController.showBookingForm);

// POST route to create a new booking
router.post('/', middleware.isLoggedIn, bookingsController.createBooking);

// GET route to fetch and render booking history
router.get('/history', middleware.isLoggedIn, bookingsController.getBookingHistory);

module.exports = router;
