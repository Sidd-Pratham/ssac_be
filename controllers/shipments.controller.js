const { where } = require("sequelize");
const {suppliers,shipments} = require("../models");
const shipmentServices=require("../services/shipments.service.js");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response.js");
async function createShipment(req,res) {
     try{
          const shipment_details={
               supplier_id:req.body.supplier_id,
               total_value:req.body.total_value,
               status:req.body.status,
               tentative_payment_date:req.body.tentative_payment_date,
               payment_date:req.body.payment_date,
               firm_associated:req.body.firm_associated,
               payment_details:req.body.payment_details
          }
          const purchase_order_details=req.body.purchase_order_detials;
          const check_supplier=await suppliers.findOne({
               where:{
                    id:shipment_details.supplier_id,  
                    deletedAt:0
               }
          });
          if(!check_supplier)
          {
               return sendErrorResponse(res,[],"Supplier not found",404)
          }
          const shipment=await shipmentServices.createShipment(shipment_details,purchase_order_details);
          return sendSuccessResponse(res,shipment,"Shipment created successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to create shipment: " +err.message,500);
     }
}

async function getAllShipments(req,res) {
     try{
          const query=req.query.query ?? null;
          const supplier_id=req.query.supplier_id ?? null;
          const status=req.query.status ?? null;
          const firm_associated=req.query.firm_associated ?? null;
          const tentative_payment_date=req.query.tentative_payment_date ?? null;
          const payment_date=req.query.payment_date ?? null;
          const product_id=req.query.product_id ?? null;
          const fetched_shipments= await shipmentServices.getAllShipments(query,supplier_id,status,firm_associated,tentative_payment_date,payment_date,product_id);
          return sendSuccessResponse(res,fetched_shipments,"Shipments found successfully",200)
     }
     catch(err)
     {
          return sendErrorResponse(res,[],"Unable to find shipments",500)
     }
}

async function getShipmentById(req,res){
     try{
          const id=req.params.id;
          const fetched_shipment=shipmentServices.getShipmentById(id);
          if(!fetched_shipment)
          {
               return sendErrorResponse(res,[],"Shipment not found",404);
          }
          return sendSuccessResponse(res,fetched_shipment,"Shipment found Successfully",200)
     }catch(err)
     {
          return sendErrorResponse(res,[],'Unable to find shipment',500);
     }
}

async function updateShipmentById(req,res) {
     try{
          const id=req.params.id;
          const check_existance=await shipmentServices.getShipmentById(id)
          if(!check_existance)
          {
               return sendErrorResponse(res,[],"Shipment not found",404);
          }
          const shipment_details={
               supplier_id:req.body.supplier_id,
               total_value:req.body.total_value,
               status:req.body.status,
               tentative_payment_date:req.body.tentative_payment_date,
               payment_date:req.body.payment_date,
               firm_associated:req.body.firm_associated,
               payment_details:req.body.payment_details
          }   
          const supplier_existance=await suppliers.findOne({
               where:{
                    id:shipment_details.supplier_id,
                    deletedAt:0
               }
          });
          if(!supplier_existance)
          {
               return sendErrorResponse(res,[],"Supplier not found",404);
          }
          const updated_shipment=await shipmentServices.updateShipmentById(shipment_details,id);
          return sendSuccessResponse(res,updated_shipment,"Shipment updated successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to find shipment",500)
     }
}
async function deleteShipmentById(req,res) {
     try{
          const id=req.params.id;
          const check_existance=await shipments.findOne({
               where:{
                    id:id,
                    deletedAt:0,
               }
          });
          if(!check_existance)
          {
               return sendErrorResponse(res,[],"Shipment not found",404);
          }
          await shipmentServices.deleteShipmentById(id);
          return sendSuccessResponse(res,[],"Shipment deleted successfully");
     }catch(err)
     {    
          return sendErrorResponse(res,[],"Unable to delete shipment: " + err.message,500);
     }
}
module.exports={createShipment,getAllShipments,getShipmentById,updateShipmentById,deleteShipmentById};