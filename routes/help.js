// routes/help.js

const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const ticketController = require('../controllers/helpController');

router.get('/', isLoggedIn, ticketController.getUserTickets);

// Create ticket
router.post('/', isLoggedIn, ticketController.createTicket);

// Get user tickets
router.get('/tickets', isLoggedIn, ticketController.getUserTickets);

// View ticket details
router.get('/tickets/:id', isLoggedIn, ticketController.viewTicket);

module.exports = router;
