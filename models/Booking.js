// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    numberOfChildren: {
        type: Number,
        required: true,
        min: 0
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
