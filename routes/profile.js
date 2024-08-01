const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Existing routes
router.get('/', profileController.renderProfile);
router.post('/update', profileController.updateProfile);
router.get('/bookings', profileController.getBookingHistory);
router.get('/reviews', profileController.getReviews);

// New route for deleting booking
router.get('/bookings/delete/:bookingId', profileController.deleteBooking);

module.exports = router;