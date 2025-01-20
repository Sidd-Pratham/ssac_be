const express=require("express");
const router=express.Router();

const VehicleRoutes=require('./api/vehicle')
router.use("/vehicle",VehicleRoutes);

const VehicleModelRoutes=require("./api/vehicle_models")
router.use("/vehicle_models",VehicleModelRoutes);

const SupplierRoutes=require("./api/suppliers");
router.use("/suppliers",SupplierRoutes);

const ProductRoutes=require("./api/products");
router.use("/products",ProductRoutes);
module.exports=router;
