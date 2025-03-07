const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    amount: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    // The user who made the donation
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The fundraiser receiving the donation
    fundraiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fundraiser',
        required: true
    },
    // Optional message from donor
    message: {
        type: String
    },
    // Payment information
    paymentId: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    }
}, { timestamps: true });

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;