require('dotenv').config();
const nodemailer = require('nodemailer');
const Ticket = require('../models/ticketSchema');
const User = require('../models/user');
const sendMail = require('../utils/email');
const { v4: uuidv4 } = require('uuid');

// Function to generate a unique ticket reference number
function generateRandomReference() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomString}`.toUpperCase();
}

// Function to send email with a 10-second delay
async function sendMailWithDelay(to, subject, html) {
    try {
        setTimeout(async () => {
            await sendMail(to, subject, html); 
            console.log('Email sent successfully');
        }, 10000); // 10 seconds delay
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { subject, description } = req.body;
        const userId = req.user._id;
        const referenceNumber = generateRandomReference();

        const newTicket = new Ticket({
            user: userId,
            subject,
            description,
            status: 'Open',
            referenceNumber,
            createdAt: new Date()
        });

        await newTicket.save();

        // Send email notification with a delay
        const userEmail = req.user.email;
        const emailSubject = 'New Ticket Created';
        const emailHtml = `
            <p>Hello,</p>
            <p>A new ticket with reference number <strong>${referenceNumber}</strong> has been created.</p>
            <p>Subject: ${subject}</p>
            <p>Description: ${description}</p>
            <p>Thank you.</p>
        `;
        await sendMailWithDelay(userEmail, emailSubject, emailHtml);

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
        const tickets = await Ticket.find({ user: req.user._id });
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

        // Check if the logged-in user is authorized to view this ticket
        if (ticket.user.toString() !== req.user._id.toString()) {
            return res.status(401).send('Unauthorized');
        }

        res.render('ticketDetail', { ticket });
    } catch (error) {
        console.error('Error viewing ticket details:', error);
        res.status(500).send('Server Error');
    }
};

