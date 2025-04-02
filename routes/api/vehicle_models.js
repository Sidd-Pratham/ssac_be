const express=require("express");
const router=express.Router();
const vehicleModelController=require("../../controllers/vehicleModels.controllers")

router.post("/",vehicleModelController.createVehicleModel);
router.get("/",vehicleModelController.getAllModels);
router.get("/:id",vehicleModelController.getModelById);
router.patch("/:id",vehicleModelController.updateModelById);
router.delete("/:id",vehicleModelController.deleteInterviewById)
module.exports=router