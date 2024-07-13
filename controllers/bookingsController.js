// controllers/bookingController.js

const Booking = require('../models/Booking');
const Listing = require('../models/listing'); // Ensure this is correctly imported
const sendMail = require('../utils/email');
const { v4: uuidv4 } = require('uuid');

// Function to generate a unique booking reference number
function generateBookingReference() {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate random string
    return `${timestamp}-${randomString}`.toUpperCase(); // Combine and format as desired
}

// Get booking history
exports.getBookingHistory = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming authenticated user ID
        const bookings = await Booking.find({ guest: userId }).populate('listing');
        res.render('bookingHistory', { bookings }); // Assuming 'bookingHistory' is your view file
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to fetch booking history.');
        res.redirect('/profile');
    }
};

exports.showBookingForm = async (req, res, next) => {
    try {
        const { listingId } = req.query;
        
        const listing = await Listing.findById(listingId).exec();
        
        res.render('booking/booking.ejs', { listing }); 
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('back');
    }
};


exports.createBooking = async (req, res, next) => {
    try {
        const { listingId, numberOfGuests, bookingDate } = req.body;
        const userId = req.user._id; 

        const bookingReference = generateBookingReference();

        const listing = await Listing.findById(listingId).exec();

        if (!listing) {
            throw new Error('Listing not found');
        }

        // Create booking instance
        const booking = new Booking({
            listing: listingId,
            guest: userId,
            numberOfGuests,
            bookingDate,
            bookingReference // Save the generated booking reference in the booking document
        });

        await booking.save();

        const userEmail = req.user.email;
        const subject = 'Booking Confirmation';
        const userName = req.user && req.user.name ? req.user.name : 'Guest';
        const html = `
            <p>Dear ${req.user.name},</p>
            <p>Your booking for ${listing.title} on ${new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} is confirmed.</p>
            <p>Booking Details:</p>
            <ul>
                <li>Listing: ${listing.title}</li>
                <li>Booking Date: ${new Date(bookingDate).toLocaleDateString('en-US')}</li>
                <li>Number of Guests: ${numberOfGuests}</li>
                <li>Booking Reference: ${bookingReference}</li>
            </ul>
            <p>Thank you for choosing us. We look forward to hosting you!</p>
            <p>Best regards,</p>
            <p>Booking Team</p>
            <p>Wnderer'sHeaven</p>
        `;

       
        await sendMail(userEmail, subject, html);

        req.flash('success', 'Booking successful!');
        res.redirect('/listing'); 
    } catch (err) {
        console.error(err);
        req.flash('error', 'Booking failed. Please try again.');
        res.redirect('back');
    }
};
