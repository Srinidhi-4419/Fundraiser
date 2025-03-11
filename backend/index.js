const express=require('express');
const cors=require('cors');
const mainroute=require("./routes/index");
// const emailRoutes = require('./routes/email');
const app=express();
app.use(cors());
app.use(express.json());
const port=3000;
app.use('/api/',mainroute);
// app.use('/api', emailRoutes);
app.listen(port,()=>{
    console.log("App listening");
})