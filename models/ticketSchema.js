const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    referenceNumber: { type: String, unique: true }, // Ensure uniqueness
    createdAt: { type: Date, default: Date.now }
});

// Create a unique index on referenceNumber
ticketSchema.index({ referenceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);
