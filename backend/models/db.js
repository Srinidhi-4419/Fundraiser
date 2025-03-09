const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/platform")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));
    
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: { type: String, required: true }, // Store the user's name for easy display
    createdAt: { type: Date, default: Date.now }
});

// Update sub-schema
const updateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const fundraiserSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    remainingAmount: { 
        type: Number, 
        required: true, 
        default: function() { return this.targetAmount; } 
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    type: { 
        type: String, 
        enum: ["Yourself", "Charity", "Someone Else"], 
        required: true 
    },
    category: { type: String, required: true },
    upiId: { type: String, required: true },
    
    // Creator reference
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donors: [{ type: String }],
    // Track all donations for this fundraiser
    donations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    }],
    
    // New fields for updates and comments
    updates: [updateSchema],
    comments: [commentSchema],
    
    // Optional: Add status field to track fundraiser state
    status: {
        type: String,
        enum: ["active", "completed", "cancelled", "paused"],
        default: "active"
    }
}, { timestamps: true });

const Fundraiser = mongoose.model("Fundraiser", fundraiserSchema);
module.exports = Fundraiser;