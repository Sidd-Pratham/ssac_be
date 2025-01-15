const express=require("express");
const router=express.Router();

const vehicleRoutes=require('./api/vehicle')
router.use("/vehicle",vehicleRoutes);

const VehicleModelRoutes=require("./api/vehicle_models")
router.use("/vehicle_models",VehicleModelRoutes)
module.exports=router;
