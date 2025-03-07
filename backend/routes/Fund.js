const express = require('express');
const multer = require('multer');
const Fundraiser = require('../models/db');
const {User}=require('../models/userdb')
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream'); // For buffer handling
require('dotenv').config();
const {authmiddleware}=require('./authmiddleware');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup for image upload (stores image as a buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to upload a buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'fundraisers' }, 
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        Readable.from(buffer).pipe(stream);
    });
};

// Create a new fundraiser with image upload & UPI ID
router.post('/fundraisers',authmiddleware, upload.single('image'), async (req, res) => {
  try {
      const { title, description, targetAmount, name, email, type, category, upiId } = req.body;

      if (!req.file) {
          return res.status(400).json({ error: "Image is required!" });
      }

      if (!upiId) {
          return res.status(400).json({ error: "UPI ID is required!" });
      }

      // Upload image to Cloudinary using buffer
      const uploadResult = await uploadToCloudinary(req.file.buffer);

      // Save fundraiser with image URL, UPI ID, and initialize remainingAmount
      // Also add user association from first example
      const newFundraiser = new Fundraiser({
          title,
          description,
          targetAmount,
          remainingAmount: targetAmount, // Initialize remainingAmount to targetAmount
          name,
          email,
          type,
          category,
          imageUrl: uploadResult.secure_url, // Store Cloudinary URL in DB
          upiId,
          createdBy: req.userid // Add user association
      });

      await newFundraiser.save();
      
      // Add fundraiser to user's fundraisersCreated array
      await User.findByIdAndUpdate(req.userid, {
          $push: { fundraisersCreated: newFundraiser._id }
      });

      res.status(201).json({ message: "Fundraiser created successfully!", fundraiser: newFundraiser });

  } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
  }
});
// Fetch all fundraisers
router.get('/fundraisers', async (req, res) => {
    try {
        const fundraisers = await Fundraiser.find();
        res.status(200).json(fundraisers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Fetch fundraisers by category
router.get('/fundraisers/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const fundraisers = await Fundraiser.find({ category });

        if (fundraisers.length === 0) {
            return res.status(404).json({ message: "No fundraisers found for this category." });
        }

        res.status(200).json(fundraisers);
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });
    }
});router.get('/fundraisers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const fundraiser = await Fundraiser.findById(id);

        if (!fundraiser) {
            return res.status(404).json({ message: "Fundraiser not found." });
        }

        res.status(200).json(fundraiser);
    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });
    }
});
// const express = require('express');
const nodemailer = require('nodemailer');
// const { authmiddleware } = require('./authmiddleware');
// const router = express.Router();

router.post('/send-email', async (req, res) => {
    const { email, message, organizerEmail } = req.body;

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    // Set up email data
    let mailOptions = {
        from: email, // Sender address
        to: organizerEmail, // List of receivers
        subject: 'Message from Fundraising Platform', // Subject line
        text: message, // Plain text body
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});
router.post('/fundraisers/:id/update-amount',async(req,res)=>{
    const { id } = req.params;
  const { amount } = req.body;
  
  try {
    // Validate input
    if (!id) {
      return res.status(400).json({ error: "Fundraiser ID is required" });
    }
    
    if (amount === undefined || isNaN(parseFloat(amount))) {
      return res.status(400).json({ error: "Valid donation amount is required" });
    }
    
    // Find fundraiser by ID
    const fundraiser = await Fundraiser.findById(id);
    
    if (!fundraiser) {
      return res.status(404).json({ error: "Fundraiser not found" });
    }
    
    // Calculate new remaining amount
    const newRemainingAmount = Math.max(0, fundraiser.remainingAmount - parseFloat(amount));
    
    // Update fundraiser
    const updatedFundraiser = await Fundraiser.findByIdAndUpdate(
      id,
      { remainingAmount: newRemainingAmount },
      { new: true } // Return the updated document
    );
    
    return res.status(200).json({
      success: true,
      message: "Fundraiser amount updated successfully",
      data: {
        id: updatedFundraiser._id,
        remainingAmount: updatedFundraiser.remainingAmount,
        raised: updatedFundraiser.targetAmount - updatedFundraiser.remainingAmount
      }
    });
    
  } catch (error) {
    console.error("Error updating fundraiser amount:", error);
    return res.status(500).json({ 
      error: "Failed to update fundraiser amount",
      details: error.message 
    });
  }
})
// router.post('/add-donor/:id', async (req, res) => {
//     try {
//         const { id } = req.params; // Extract fundraiser ID from URL parameter
//         const { firstname } = req.body; // Extract firstname from request body

//         if (!firstname) {
//             return res.status(400).json({ message: "Firstname is required" });
//         }

//         // Find the fundraiser by ID and push the firstname into the donors array
//         const fundraiser = await Fundraiser.findByIdAndUpdate(
//             id,
//             { $push: { donors: firstname } }, // Add firstname to donors array
//             { new: true } // Return the updated document
//         );

//         if (!fundraiser) {
//             return res.status(404).json({ message: "Fundraiser not found" });
//         }

//         res.json({ message: "Donor added successfully", fundraiser });
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// });
// module.exports = router;
// Route to get all donors for a specific fundraiser by ID
router.get('/fundraiser/:id/donors', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate fundraiser ID
      if (!id) {
        return res.status(400).json({ message: "Fundraiser ID is required" });
      }
      
      // Find the fundraiser by ID
      const fundraiser = await Fundraiser.findById(id);
      
      if (!fundraiser) {
        return res.status(404).json({ message: "Fundraiser not found" });
      }
      
      // Check if the fundraiser has donors
      if (!fundraiser.donors || fundraiser.donors.length === 0) {
        return res.json({ 
          fundraiserId: id, 
          donorsCount: 0, 
          donors: [] 
        });
      }
      
      // Return the list of donors
      return res.json({
        fundraiserId: id,
        donorsCount: fundraiser.donors.length,
        donors: fundraiser.donors
      });
      
    } catch (error) {
      console.error("Error fetching donors:", error);
      
      // Check if error is due to invalid ID format
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid fundraiser ID format" });
      }
      
      return res.status(500).json({ 
        message: "Internal Server Error", 
        error: error.message 
      });
    }
  });
  router.get('/fundraisers/:id/donors/count', async (req, res) => {
    try {
      const fundraiserId = req.params.id;
      
      // Find fundraiser by ID using the Fundraiser model/database
      const fundraiser = await Fundraiser.findById(fundraiserId);
      
      // Check if fundraiser exists
      if (!fundraiser) {
        return res.status(404).json({
          success: false,
          error: 'Fundraiser not found'
        });
      }
      
      // Get the donors array
      const donors = fundraiser.donors || [];
      
      // Return the count of donors
      return res.status(200).json({
        success: true,
        fundraiserId: fundraiserId,
        donorsCount: donors.length
      });
      
    } catch (error) {
      console.error('Error getting donors count:', error);
      return res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  });
  router.get('/fundraisers/search', async (req, res) => {
    try {
        const { title } = req.query;
        
        // Case-insensitive search for fundraisers by title
        const fundraisers = await Fundraiser.find({ 
            title: { $regex: title, $options: 'i' } 
        });
        
        res.status(200).json(fundraisers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
