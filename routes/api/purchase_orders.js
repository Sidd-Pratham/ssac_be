const express=require("express");
const router=express.Router();
const PurchaseOrdersController=require("../../controllers/purchase_orders");

router.post("/",PurchaseOrdersController.createPurchaseOrders);
router.patch("/:id",PurchaseOrdersController.updatePurchaseOrderById);
module.exports=router;