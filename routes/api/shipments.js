const express=require("express");
const router=express.Router();
const shipmentController=require("../../controllers/shipments.controller");

router.post("/",shipmentController.createShipment);
router.get("/",shipmentController.getAllShipments);
router.get("/:id",shipmentController.getShipmentById);
router.patch("/:id",shipmentController.updateShipmentById);
router.delete("/:id",shipmentController.deleteShipmentById);
module.exports=router;