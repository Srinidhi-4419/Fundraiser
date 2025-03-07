const {JWT_SECRET}=require('../models/config');
const jwt=require('jsonwebtoken');
const authmiddleware=(req,res,next)=>{
const authheader=req.headers.authorization;
if(!authheader || !authheader.startsWith("Bearer")){
    res.status(411).json({
        msg:"Inavlid"
    })
}
const token=authheader.split(' ')[1];
try{
    const decoded=jwt.verify(token,JWT_SECRET);
    req.userid=decoded.userid;
    next();
}catch(error){
    return res.status(403).json({});
}
}
module.exports={
    authmiddleware
}