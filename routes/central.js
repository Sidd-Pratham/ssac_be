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

const BillRoutes=require("./api/bills");
router.use("/bills",BillRoutes);

const SaleOrdersRoutes=require("./api/sale_orders");
router.use("/sale_orders",SaleOrdersRoutes);

const ShipmentRoutes=require("./api/shipments");
router.use("/shipments",ShipmentRoutes);

const PurchaseOrderRoutes=require("./api/purchase_orders");
router.use("/purchase_orders",PurchaseOrderRoutes)

module.exports=router;
