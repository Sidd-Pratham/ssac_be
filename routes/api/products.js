const express=require("express");
const router=express.Router();
const productController=require("../../controllers/products.controller")

router.post("/",productController.createProduct);
router.get("/",productController.getAllProducts);
router.get("/code/:code",productController.getProductByCode);
router.get("/:id",productController.getProductById);
router.patch("/:id",productController.updateProductById);
router.delete("/:id",productController.deleteProductById)

module.exports=router;