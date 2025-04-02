const supplierController=require("../../controllers/suppliers.controller");

const express=require("express");
const router=express.Router();

router.post("/",supplierController.createSupplier);
router.get("/",supplierController.getAllSuppliers);
router.get("/:id",supplierController.getSupplierById);
router.patch("/:id",supplierController.updateSupplierById);
router.delete("/:id",supplierController.deleteSupplierById)

module.exports=router;