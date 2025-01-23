const express=require("express");
const router=express.Router();
const billsController=require("../../controllers/bills.controller");
router.post("/",billsController.createBill);
router.get("/",billsController.getAllBills);
router.get("/:id",billsController.getBillById);
router.patch("/:id",billsController.updateBillById);
router.delete("/:id",billsController.deleteBillById)
module.exports=router;