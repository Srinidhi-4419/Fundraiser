const express = require('express');
const router = express.Router();
const zod = require('zod');
const { User } = require('../models/userdb');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../models/config');
const { authmiddleware } = require('./authmiddleware');
const Fundraiser=require('../models/db')
const Donation=require('../models/Donation');
const axios=require('axios');
const signupbody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstname: zod.string(),
    lastname: zod.string()
});

router.post('/signup', async (req, res) => {
    const { success } = signupbody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ msg: "Incorrect inputs" });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(411).json({ msg: "Email already taken" });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });

    const token = jwt.sign({ userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        msg: "User created successfully",
        token: token
    });
});
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
});

router.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ msg: "Invalid email or password format" });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user || user.password !== req.body.password) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        msg: "Signin successful",
        token: token
    });
});
const updatedbody = zod.object({
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
    password: zod.string().optional()
});

router.put('/update', authmiddleware, async (req, res) => {
    const { success } = updatedbody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Error while updating" });
    }

    await User.updateOne({ _id: req.userid }, { $set: req.body });

    res.json({
        msg: 'Updated successfully'
    });
});
// router.get('/bulk',async(req,res)=>{
//     const filter=req.query.filter || "";
    
//     const users = await User.find({
//         $or: [
//             { firstname: { $regex: filter, $options: "i" } },
//             { lastname: { $regex: filter, $options: "i" } }
//         ]
//     });
//         res.json({
//             user:users.map(user=>({
//                 username:user.username,
//                 firstname:user.firstname,
//                 lastname:user.lastname,
//                 _id:user._id
//             }))
//         })
    
// })
router.post('/getinfo', async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      
      // Assuming you have a User model
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user's first name and last name
      return res.json({
        firstname: user.firstname,
        lastname: user.lastname
      });
      
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
  
  // 2. Second endpoint: Add donor to fundraiser
  router.post('/fundraiser/add-donor', async (req, res) => {
    try {
      const { username, fundraiserId } = req.body;
      
      if (!username || !fundraiserId) {
        return res.status(400).json({ message: "Username and fundraiserId are required" });
      }
      
      let donorName;
      
      // Check if donation is anonymous
      if (username === "Anonymous") {
        // Use "Anonymous" directly without fetching user info
        donorName = "Anonymous";
      } else {
        // Get user information for non-anonymous donations
        try {
          // Using axios to make an internal request to our user info endpoint
          const userResponse = await axios.post(
            'http://localhost:3000/api/user/getinfo', 
            { username }
          );
          
          const { firstname, lastname } = userResponse.data;
          
          // Format donor name (e.g., "John Doe")
          donorName = `${firstname} ${lastname}`;
        } catch (axiosError) {
          console.error("Error getting user info:", axiosError.message);
          
          if (axiosError.response && axiosError.response.status === 404) {
            return res.status(404).json({ message: "User not found" });
          }
          
          return res.status(502).json({ 
            message: "Error retrieving user data", 
            error: axiosError.message 
          });
        }
      }
      
      // Add donor to fundraiser
      const fundraiser = await Fundraiser.findByIdAndUpdate(
        fundraiserId,
        { $push: { donors: donorName } },
        { new: true }
      );
      
      if (!fundraiser) {
        return res.status(404).json({ message: "Fundraiser not found" });
      }
      
      return res.json({
        message: "Donor added successfully",
        fundraiser
      });
      
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
  router.get('/donations', authmiddleware, async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.userid })
            .populate('fundraiser')
            .sort({ createdAt: -1 });
        
        res.status(200).json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/dashboard-summary', authmiddleware, async (req, res) => {
  try {
      const fundraisers = await Fundraiser.find({ createdBy: req.userid });
      const donations = await Donation.find({ donor: req.userid });
      
      // Calculate statistics
      const totalRaised = fundraisers.reduce((sum, fundraiser) => 
          sum + (fundraiser.targetAmount - fundraiser.remainingAmount), 0);
          
      const totalDonated = donations.reduce((sum, donation) => 
          sum + donation.amount, 0);
      
      const activeFundraisers = fundraisers.filter(
          fundraiser => fundraiser.remainingAmount > 0
      ).length;
      
      res.status(200).json({
          totalFundraisers: fundraisers.length,
          activeFundraisers,
          totalRaised,
          totalDonated,
          donationsCount: donations.length,
          fundraisers: fundraisers // Include the actual fundraiser data
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
router.post('/donate', authmiddleware, async (req, res) => {
  try {
      const { fundraiserId, amount } = req.body;
      
      // Get the fundraiser
      const fundraiser = await Fundraiser.findById(fundraiserId);
      if (!fundraiser) {
          return res.status(404).json({ error: 'Fundraiser not found' });
      }
      
      // Create donation
      const donation = new Donation({
          amount,
          donor: req.userid,
          fundraiser: fundraiserId,
          paymentStatus: 'completed'
      });
      
      await donation.save();
      
      // REMOVE THIS PART - don't update the amount here
      // fundraiser.remainingAmount = Math.max(0, fundraiser.remainingAmount - amount);
      
      // Add donation to fundraiser's donations array
      fundraiser.donations.push(donation._id);
      await fundraiser.save();
      
      // Add donation to user's donationsMade array
      await User.findByIdAndUpdate(req.user._id, {
          $push: { donationsMade: donation._id }
      });
      
      res.status(201).json(donation);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
module.exports = router;
