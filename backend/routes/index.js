const express=require('express');
const router=express.Router();
const userroute=require('./User');
const fundroute=require('./Fund');
router.use('/user',userroute);
router.use('/fund',fundroute);
module.exports=router;