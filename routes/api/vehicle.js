const express=require('express');
const router=express.Router();
const vehicleController=require('../../controllers/vehicle.controller');

router.post("/",vehicleController.createVehicle);
router.get("/",vehicleController.getAllVehicles);
router.get("/:id",vehicleController.getVehiclebyId);
router.patch("/:id",vehicleController.updateVehicleById);
router.delete("/:id",vehicleController.deleteVehicle);
module.exports=router;
