const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/', profileController.renderProfile);
router.post('/update', profileController.updateProfile);
router.get('/bookings', profileController.getBookingHistory);
router.get('/reviews', profileController.getReviews);

module.exports = router;
