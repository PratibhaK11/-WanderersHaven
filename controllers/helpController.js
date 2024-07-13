const Ticket = require('../models/ticketSchema');
const { v4: uuidv4 } = require('uuid');

function generateRandomReference() // Function to generate a unique booking reference number
 {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate random string
    return `${timestamp}-${randomString}`.toUpperCase(); // Combine and format as desired
}


// Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { subject, description } = req.body;

        const referenceNumber = generateRandomReference();

        const newTicket = new Ticket({
            user: req.user.id,
            subject,
            description,
            status: 'Open',
            referenceNumber,
            createdAt: new Date()
        });

        await newTicket.save();

        res.redirect('/help');
    } catch (error) {
        console.error('Error creating ticket:', error);
        if (error.code === 11000 && error.keyValue && error.keyPattern) {
            return res.status(500).send('Duplicate ticket reference number');
        }
        res.status(500).send('Server Error');
    }
};

// Get user tickets
exports.getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id });
        res.render('help', { tickets }); // Pass tickets array to the template
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// View ticket details
exports.viewTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send('Ticket not found');
        }
        if (ticket.user.toString() !== req.user.id) {
            return res.status(401).send('Unauthorized');
        }
        res.render('ticketDetail', { ticket });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
