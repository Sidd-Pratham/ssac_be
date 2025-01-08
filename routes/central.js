const express=require("express");
const router=express.Router();

const vehicleRoutes=require('./api/vehicle')
router.use("/vehicle",vehicleRoutes);

module.exports=router;
