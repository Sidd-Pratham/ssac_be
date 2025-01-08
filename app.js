const express=require('express');
const app=express();
const dotenv=require("dotenv");
dotenv.config();

const port=process.env.PORT || 2127;
app.listen(port,()=>{
     console.log(`Server running at port:${port}`);
})