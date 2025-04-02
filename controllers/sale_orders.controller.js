const saleOrderService=require("../services/sale_orders.service")
const { bills,products,sale_orders } = require("../models");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

async function createSaleOrder(req,res) {
     try{
          const sale_order_data={
               bill_id:req.body.bill_id,
               product_id:req.body.product_id,
               product_quantity:req.body.product_quantity,
               unit_price:req.body.unit_price,
               total_price:req.body.total_price
          }
          const check_bill_existance=await bills.findByPk(sale_order_data.bill_id);
          if(!check_bill_existance)
          {
               return sendErrorResponse(res,[],"Bill not found",404);
          }
          const product_existance=await products.findByPk(sale_order_data.product_id);
          if(!product_existance)
          {
               return sendErrorResponse(res,[],"Product not found",404);
          }
          const sale_order= await saleOrderService.createSaleOrder(sale_order_data);
          return sendSuccessResponse(res,sale_order,"Sale order generated successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to create sale order: " + err.message,500);
     }
}
async function deleteSaleOrderById(req,res){
     try{
          const id=req.params.id;
          const sale_order=await sale_orders.findByPk(id);
          const check_bill_existance=await bills.findByPk(sale_order.bill_id);
          if(!check_bill_existance)
          {
               return sendErrorResponse(res,[],"Bill not found",404);
          }
          const product_existance=await products.findByPk(sale_order.product_id);
          if(!product_existance)
          {
               return sendErrorResponse(res,[],"Product not found",404);
          }
          await saleOrderService.deleteSaleOrderById(id);
          return sendSuccessResponse(res,[],"Sale order deleted successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to delete sale order: " + err.message,500);
     }
}

async function updateSaleOrderById(req,res) {
     try{
          const id=req.params.id;
          const sale_order_data={
               bill_id:req.body.bill_id,
               product_id:req.body.product_id,
               product_quantity:req.body.product_quantity,
               unit_price:req.body.unit_price,
               total_price:req.body.total_price
          }
          const sale_order=await sale_orders.findByPk(id);
          const check_bill_existance=await bills.findByPk(sale_order.bill_id);
          if(sale_order.bill_id!=sale_order_data.bill_id)
          {
               return sendErrorResponse(res,[],"Sale order doesn't belong to this bill",500);
          }
          if(sale_order.product_id!=sale_order_data.product_id)
          {
               return sendErrorResponse(res,[],"Product couldn't be edited for sale order",500);
          }
          if(!check_bill_existance)
          {
               return sendErrorResponse(res,[],"Bill not found",404);
          }
          const product_existance=await products.findByPk(sale_order.product_id);
          if(!product_existance)
          {
               return sendErrorResponse(res,[],"Product not found",404);
          }
          const updated_sale_order=await saleOrderService.updateSaleOrderById(sale_order_data,id);
          return sendSuccessResponse(res,updated_sale_order,"Sale Order updated successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to update sale order",500)
     }
}
module.exports={createSaleOrder, deleteSaleOrderById,updateSaleOrderById}