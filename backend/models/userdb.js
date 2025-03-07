const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/platform").then(()=>{
    console.log('Mongodb connected');
}).catch((error)=>{
    console.log(error);
})
// const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    firstname: {
        type: String,
        required: true,
        minlength: 1,
    },
    lastname: {
        type: String,
        required: true,
        minlength: 1,
    },
    // Track fundraisers created by this user
    fundraisersCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fundraiser'
    }],
    // Track donations made by this user
    donationsMade: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = {User};