const { where } = require("sequelize");
const {purchase_orders,shipments,products} = require("../models");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");
const PurchaseOrderServices = require("../services/purchase_orders");

async function createPurchaseOrders(req,res) {
     try{
          const purchase_order_details={
               shipment_id:req.body.shipment_id,
               product_id:req.body.product_id,
               product_quantity:req.body.product_quantity,
               unit_price:req.body.unit_price,
               total_price:req.body.total_price
          }
          const shipment_exists=await shipments.findOne({
               where:{
                    id:purchase_order_details.shipment_id,
                    deletedAt:0
               }
          }) 
          if(!shipment_exists)
          {
               return sendErrorResponse(res,[],"Shipment not found",404)
          }
          const product_exists=await products.findOne({
               where:{
                    id:purchase_order_details.product_id,
                    deletedAt:0
               }
          });
          if(!product_exists)
          {
               return sendErrorResponse(res,[],"Product not found",404)
          }
          const similar_product_in_shipment_exists = await purchase_orders.findOne({
               where:{
                    product_id:purchase_order_details.product_id,
                    shipment_id:purchase_order_details.shipment_id
               }
          })
          if(similar_product_in_shipment_exists){
               return sendErrorResponse(res,[],"Similar Product already exists for this shipment",500)
          }
          const new_purchase_order=await PurchaseOrderServices.createPurchaseOrders(purchase_order_details);
          return sendSuccessResponse(res,new_purchase_order,"Purchase order create successfully",200);
     }
     catch(err)
     {
          return sendErrorResponse(res,[],"Unable to create Purchase Order:" + err.message,500)
     }
}

async function updatePurchaseOrderById(req,res)
{
     try{
          const id=req.params.id;
          const purchase_order_details={
               shipment_id:req.body.shipment_id,
               product_id:req.body.product_id,
               product_quantity:req.body.product_quantity,
               unit_price:req.body.unit_price,
               total_price:req.body.total_price
          }
          const purchase_order=await purchase_orders.findByPk(id);
          const check_shipment_existance=await shipments.findByPk(purchase_order_details.shipment_id);
          if(purchase_order.shipment_id!=purchase_order_details.shipment_id)
          {
               return sendErrorResponse(res,[],"Purchase Order doesn't belong to this shipment",500);
          }
          if(purchase_order.product_id!=purchase_order_details.product_id)
          {
               return sendErrorResponse(res,[],"Product couldn't be edited for Purchase order",500);
          }
          if(!check_shipment_existance)
          {
               return sendErrorResponse(res,[],"Shipment not found",404);
          }
          const product_existance=await products.findByPk(purchase_order_details.product_id);
          if(!product_existance)
          {
               return sendErrorResponse(res,[],"Product not found",404);
          }
          const updated_sale_order=await PurchaseOrderServices.updatePurchaseOrderById(purchase_order_details,id);
          return sendSuccessResponse(res,updated_sale_order,"Purchase order updated successfully",200);
     }catch(err)
     {
          sendErrorResponse(res,[],"Unable to update purchase order:" + err.message,500);
     }
}
module.exports={
     createPurchaseOrders,
     updatePurchaseOrderById
}