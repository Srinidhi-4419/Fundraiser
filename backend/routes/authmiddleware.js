const { JWT_SECRET } = require('../models/config');
const jwt = require('jsonwebtoken');

const authmiddleware = (req, res, next) => {
  console.log("Auth middleware called");
  const authheader = req.headers.authorization;
  
  // Check if auth header exists and has correct format
  if (!authheader || !authheader.startsWith("Bearer")) {
    console.log("Missing or invalid authorization header");
    return res.status(411).json({
      msg: "Invalid authorization header"
    });
  }
  
  const token = authheader.split(' ')[1];
  console.log("Token extracted:", token ? "exists" : "missing");
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token verified, user ID:", decoded.userid);
    req.userid = decoded.userid;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({
      message: "Authentication failed: " + error.message
    });
  }
};

module.exports = {
  authmiddleware
};