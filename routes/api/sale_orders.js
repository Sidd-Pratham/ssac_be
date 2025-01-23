const express=require("express");
const router=express.Router();
const saleOrderContoller=require("../../controllers/sale_orders.controller");

router.post("/",saleOrderContoller.createSaleOrder);
router.delete("/:id",saleOrderContoller.deleteSaleOrderById);
router.patch("/:id",saleOrderContoller.updateSaleOrderById)

module.exports=router;