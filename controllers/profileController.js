const User = require('../models/user');
const Booking = require('../models/Booking');
const Review = require('../models/reviews');

// Render profile page
exports.renderProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    const bookings = await Booking.find({ guest: userId }).populate('listing').limit(5);
    const reviews = await Review.find({ userId }).limit(5);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/');
    }
    res.render('profile', { user, bookings, reviews });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load profile.');
    res.redirect('/');
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email } = req.body;

    console.log(`Updating profile for user: ${userId} with email: ${email}`);
    await User.findByIdAndUpdate(userId, { email });

    req.flash('success', 'Profile updated successfully.');
    res.redirect('/profile');
  } catch (err) {
    console.error(`Failed to update profile: ${err.message}`);
    console.error(err.stack);
    req.flash('error', 'Failed to update profile.');
    res.redirect('/profile');
  }
};
// Render full booking history
exports.getBookingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ guest: userId }).populate('listing');

    res.render('bookingHistory', { bookings });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load booking history.');
    res.redirect('/profile');
  }
};

// Render full reviews
exports.getReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ userId });

    res.render('reviews', { reviews });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load reviews.');
    res.redirect('/profile');
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    console.log(`Attempting to delete booking: ${bookingId}`);

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    console.log(`Booking deleted successfully: ${bookingId}`);
    req.flash('success', 'Booking deleted successfully.');
    res.redirect('/profile/bookings');
  } catch (err) {
    console.error(`Failed to delete booking: ${err.message}`);
    console.error(err.stack);
    req.flash('error', 'Failed to delete booking.');
    res.redirect('/profile/bookings');
  }
};