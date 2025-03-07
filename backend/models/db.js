const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/platform")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

const fundraiserSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },  // Store image URL instead of Buffer
    targetAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true, default: function() { return this.targetAmount; } }, // Initialize to targetAmount
    name: { type: String, required: true },
    email: { type: String, required: true }, // Made email required
    type: { type: String, enum: ["Yourself", "Charity", "Someone Else"], required: true },
    category: { type: String, required: true },
    upiId: { type: String, required: true } ,
    donors: [{ type: String }]
}, { timestamps: true });

const Fundraiser = mongoose.model("Fundraiser", fundraiserSchema);

module.exports = Fundraiser;
