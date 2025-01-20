const { where } = require("sequelize")
const {suppliers, sequelize} = require("../models")
const supplierServices=require("../services/suppliers.service")
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const Sequelize=require("sequelize");
const Op = Sequelize.Op;
async function createSupplier(req,res) {
     try{
          const supplier_data={
               name: req.body.name,
               contact_number: req.body.contact_number,
               address: req.body.address,
               sales_person_name: req.body.sales_person_name,
               sales_person_contact_number: req.body.sales_person_contact_number,
               bank_account_number: req.body.bank_account_number,
               bank_branch_name: req.body.bank_branch_name,
               bank_branch_ifsc: req.body.bank_branch_ifsc,
               supplier_gst_number: req.body.supplier_gst_number    
          }
          const check_duplicacy=await suppliers.findOne({
               where:{
                    name:supplier_data.name,
                    deletedAt:0
               }
          })
          if(check_duplicacy)
          {
               return sendErrorResponse(res,[],"supplier with simnilar name already exists",500)
          }
          const new_supplier=await supplierServices.createSupplier(supplier_data);
          return sendSuccessResponse(res,new_supplier,"New supplier created successfully",200)
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to create supplier: " + err.message,500);
     }
}
async function getAllSuppliers(req,res) {
     try{
          const query=req.query.query
          const fetched_data=await supplierServices.getAllSuppliers(query);
          return sendSuccessResponse(res,fetched_data,"Supplier(s) found successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Issue fetching suppliers: "+err.message,200)
     }
}
async function getSupplierById(req,res) {
     try{
          const id=req.params.id;
          const supplier=await supplierServices.getSupplierById(id);
          if(!supplier)
          {
               return sendSuccessResponse(res,[],"No supplier found",404);
          }
          return sendSuccessResponse(res,supplier,"Supplier found sucessfully",200);
     }catch(err){
          return sendErrorResponse(res,[],"Unable to find supplier: " + err.message,500)
     }
}
async function updateSupplierById(req,res) {
     try{ 
          const id=req.params.id;
          const supplier_data={
               name: req.body.name,
               contact_number: req.body.contact_number,
               address: req.body.address,
               sales_person_name: req.body. sales_person_name,
               sales_person_contact_number: req.body.sales_person_contact_number,
               bank_account_number: req.body.bank_account_number,
               bank_branch_name: req.body.bank_branch_name,
               bank_branch_ifsc: req.body.bank_branch_ifsc,
               supplier_gst_number: req.body.supplier_gst_number    
          }
          const check_existance=await supplierServices.getSupplierById(id);
          if(!check_existance)
          {
               return sendErrorResponse(res,[],"Supplier not found",404);
          }
          const check_duplicacy=await suppliers.findOne({
               where:{
                    id:{[Op.ne]:id},
                    name:supplier_data.name
               }
          });
          if(check_duplicacy)
          {
               return sendErrorResponse(res,[],"Similar supplier name already exists",500);
          }
          const updated_supplier=await supplierServices.updateSupplierById(supplier_data,id);
          return sendSuccessResponse(res,updated_supplier,"Supplier updated Successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to update supplier: " + err.message,500);
     }
}
async function deleteSupplierById(req,res) {
     try{
          const id=req.params.id;
          const check_existance=await supplierServices.getSupplierById(id);
          if(!check_existance)
          {
               return sendErrorResponse(res,[],"Supplier not found",404);
          }
          const supplier_data={deletedAt:1};
          const deleted_supplier=await supplierServices.updateSupplierById(supplier_data,id);
          return sendSuccessResponse(res,deleted_supplier,"Supplier deleted successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to delete supplier: " + err.message,500);
     }
}
module.exports={
     createSupplier,
     getAllSuppliers,
     getSupplierById,
     updateSupplierById,
     deleteSupplierById
}