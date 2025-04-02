const { sequelize } = require("../models");
const billsService=require("../services/bills.service");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
async function createBill(req,res) {
     try{
          const bill_details={
               consumer_contact:req.body.consumer_contact,
               total_order_value:req.body.total_order_value,
               total_received_payment:req.body.total_received_payment,
               payment_method:req.body.payment_method,
               total_profit:req.body.total_profit,
               payment_status:req.body.payment_status,
               billing_date:req.body.billing_date ?? Date.now()
          }
          const sale_orders_details=req.body.sale_orders_details;
          const generated_bill=await billsService.createBill(bill_details,sale_orders_details);
          if (!generated_bill) 
          {
               return sendErrorResponse(res,[],"Unable to generate bill: " + err.message,500)
          }
          return sendSuccessResponse(res,generated_bill,"Bill generated successfully",200)
          
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to generate bill: " + err.message,500)
     }
}

async function getAllBills(req,res){
     try{
          const query=req.query.query ?? null;
          const status=req.query.payment_status ?? null;
          const date=req.query.billing_date ??null;
          const product_id=req.query.product_id?? null;
          const fetched_bills=await billsService.getAllBills(query,status,date,product_id);
          return sendSuccessResponse(res,fetched_bills,"Bills found successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to find bills: " + err.message,200);
     }
}
async function getBillById(req,res) {
     try{
          const id=req.params.id;
          const fetched_bill_details=await billsService.getBillById(id);
          if(!fetched_bill_details)
          {
               return sendErrorResponse(res,[],"Bill not found",500)
          }
          return sendSuccessResponse(res,fetched_bill_details,"Bill found Successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to find Bill: " + err.message,500)
     }
}
async function updateBillById(req,res) {
     try{
          const id=req.params.id;
          const check_existance=await billsService.getBillById(id)
          if(!check_existance)
          {
               return sendErrorResponse(res,[],"Bill not found",404);
          }
          const bill_details={
               consumer_contact:req.body.consumer_contact,
               total_order_value:req.body.total_order_value,
               total_received_payment:req.body.total_received_payment,
               payment_method:req.body.payment_method,
               total_profit:req.body.total_profit,
               payment_status:req.body.payment_status,
          }    
          if(req.body.billing_date)
          {
               bill_details.billing_date=req.body.billing_date
          }
          const updated_bill=await billsService.updateBillById(bill_details,id);
          return sendSuccessResponse(res,updated_bill,"Bill updated successfully",200);
     }
     catch(err)
     {
          return sendErrorResponse(res,[],"Unable to update bill: " + err.message,500);
     }
}
async function deleteBillById(req,res) {
     try{
          const id=req.params.id;
          const check_existance=await billsService.getBillById(id)
          if(!check_existance)
          {
               return sendErrorResponse(res,[],"Bill not found",404);
          }
          await billsService.deleteBillById(id);
          return sendSuccessResponse(res,[],"Bill deleted successfully",200)
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to delete bill: " + err.message,500);
     }
}
module.exports={createBill,getAllBills,getBillById,updateBillById,deleteBillById}