// controllers/bookingController.js

const Booking = require('../models/Booking');
const Listing = require('../models/listing'); 
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
        const userId = req.user._id; 
        const bookings = await Booking.find({ guest: userId }).populate('listing');
        res.render('bookingHistory', { bookings }); 
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
        const { listingId, numberOfGuests, checkInDate, checkOutDate, numberOfChildren } = req.body;
        const userId = req.user._id;

        const bookingReference = generateBookingReference();

        const listing = await Listing.findById(listingId).exec();

        if (!listing) {
            throw new Error('Listing not found');
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            throw new Error('Check-out date must be after the check-in date.');
        }

        const booking = new Booking({
            listing: listingId,
            guest: userId,
            numberOfGuests,
            checkInDate,
            checkOutDate,
            numberOfChildren,
            bookingReference
        });

        await booking.save();

        // Increment booking count for the listing
        listing.bookingCount = (listing.bookingCount || 0) + 1;
        await listing.save();

        const userEmail = req.user.email;
        const subject = 'Booking Confirmation';
        const userName = req.user && req.user.name ? req.user.name : 'Guest';
        const html = `
            <p>Dear ${userName},</p>
            <p>Your booking for ${listing.title} from ${checkIn.toLocaleDateString('en-US')} to ${checkOut.toLocaleDateString('en-US')} is confirmed.</p>
            <p>Booking Details:</p>
            <ul>
                <li>Listing: ${listing.title}</li>
                <li>Check-In Date: ${checkIn.toLocaleDateString('en-US')}</li>
                <li>Check-Out Date: ${checkOut.toLocaleDateString('en-US')}</li>
                <li>Number of Guests: ${numberOfGuests}</li>
                <li>Number of Children: ${numberOfChildren}</li>
                <li>Booking Reference: ${bookingReference}</li>
            </ul>
            <p>Thank you for choosing us. We look forward to hosting you!</p>
            <p>Best regards,</p>
            <p>Booking Team</p>
            <p>Wanderer's Haven</p>
        `;

        await sendMail(userEmail, subject, html);

        req.flash('success', 'Booking successful!');
        res.redirect('/listing');
    } catch (err) {
        console.error(err);
        req.flash('error', err.message || 'Booking failed. Please try again.');
        res.redirect('back');
    }
};