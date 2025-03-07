const express = require('express');
const router = express.Router();
const zod = require('zod');
const { User } = require('../models/userdb');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../models/config');
const { authmiddleware } = require('./authmiddleware');
const Fundraiser=require('../models/db')
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
      
      // Get user information first
      try {
        // Using axios to make an internal request to our user info endpoint
        const userResponse = await axios.post(
          'http://localhost:3000/api/user/getinfo', 
          { username }
        );
        
        const { firstname, lastname } = userResponse.data;
        
        // Format donor name (e.g., "John Doe")
        const donorName = `${firstname} ${lastname}`;
        
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
      
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
module.exports = router;
