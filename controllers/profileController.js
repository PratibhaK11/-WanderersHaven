const User = require('../models/user');
const Booking = require('../models/Booking');
const Review = require('../models/reviews');

// Render profile page
exports.renderProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authenticated user ID
    const user = await User.findById(userId);
    // Populate 'listing' and 'guest' fields in the Booking model
    const bookings = await Booking.find({ guest: userId }).populate('listing').limit(5);
    const reviews = await Review.find({ userId }).limit(5); // Limit to 5 recent reviews

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
    const userId = req.user._id; // Assuming authenticated user ID
    const { email } = req.body; // Update other fields as needed

    await User.findByIdAndUpdate(userId, { email });
    req.flash('success', 'Profile updated successfully.');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
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
