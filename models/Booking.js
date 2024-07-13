

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
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
