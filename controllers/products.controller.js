const {products, sequelize} = require("../models");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");
const productServices=require("../services/products.service");
const { where } = require("sequelize/lib/sequelize");
const Sequelize=require("sequelize");
const Op = Sequelize.Op;
async function createProduct(req,res) {
     try{
          console.log(req.body)
          const product_data={
               name:req.body.name,
               product_code:req.body.product_code,
               quantity:req.body.quantity,
               category:req.body.category,
               manufacturer_name:req.body.manufacturer_name,
               avg_cost_price:req.body.avg_cost_price,
               selling_price:req.body.selling_price,
               product_mrp:req.body.product_mrp,
               description:req.body.description,
               profit:req.body.profit
          }
          const associatedVehicles=JSON.parse(req.body.associated_vehicles);
          const associatedModels=JSON.parse(req.body.associated_models);
          const similar_product_code=await products.findOne({
               where:{
                    product_code:product_data.product_code,
               }
          })
          if(similar_product_code)
          {
               return sendErrorResponse(res,[],"Similar product already exists",500);
          }
          const new_product=await productServices.createProduct(product_data,associatedVehicles,associatedModels);
          return sendSuccessResponse(res,new_product,"Product created Successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to create new Product: " + err.message,500)
     }
}
async function getAllProducts(req,res) {
     try{
          const query=req.query.query;
          const category=req.query.category;
          const vehicle_id=req.query.vehicle_id;
          const vehicle_model_id=req.query.vehicle_model_id;
          const fetched_products=await productServices.getAllProducts(query,category,vehicle_id,vehicle_model_id)
          return sendSuccessResponse(res,fetched_products,"Products found Successfully",200); 
     }
    catch(err)
    {
     return sendErrorResponse(res,[],"Unable to get products:" + err.message,500)
    }
}

async function getProductByCode(req,res){
     try{
          const code=req.params.code;
          const product_details= await productServices.getProductByCode(code);
          if(!product_details)
          {
               return sendErrorResponse(res,[],"Product not found",500)
          }
          return sendSuccessResponse(res,product_details,"Product found Successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Undable to get product: " + err.message,500)
     }
}

async function getProductById(req,res) {
     try{
          const id=req.params.id;
          const product_details=await productServices.getProductById(id);
          if(!product_details)
          {
               return sendErrorResponse(res,[],"Product not found",500)
          }
          return sendSuccessResponse(res,product_details,"Product found successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to get product: " + err.message,500)
     }
}

async function updateProductById(req,res) {
     try{
          const id=req.params.id;
          const product_data={
               name:req.body.name,
               product_code:req.body.product_code,
               quantity:req.body.quantity,
               category:req.body.category,
               manufacturer_name:req.body.manufacturer_name,
               avg_cost_price:req.body.avg_cost_price,
               selling_price:req.body.selling_price,
               product_mrp:req.body.product_mrp,
               description:req.body.description,
               profit:req.body.profit
          }
          const associatedVehicles=JSON.parse(req.body.associated_vehicles);
          const associatedModels=JSON.parse(req.body.associated_models);

          const check_existance=await productServices.getProductById(id);
          if(!check_existance)
          {
               return sendErrorResponse(res,[],"Product not found",500);
          }
          const similar_product_code=await products.findOne({
               where:{
                    product_code:product_data.product_code,
                    id:{[Op.ne]:id},
               }
          })
          if(similar_product_code)
          {
               return sendErrorResponse(res,[],"Similar product already exists",500);
          }
          const updated_product= await productServices.updateProductById(product_data,id,associatedVehicles,associatedModels);
          if(!updated_product)
          {
               return sendErrorResponse(res,[],"Unable to update product",500)
          }
          return sendSuccessResponse(res,updated_product,"Product updated successfully",200)
     }catch(err)
     {
          return sendSuccessResponse(res,[],"Unable to update Product: "+err.message,500)
     }
}

async function deleteProductById(req,res) {
     try{
          const id=req.params.id;
          const check_existance=await products.findOne({
               where:{
                    id:id,
                    deletedAt:0
               }});
          if(!check_existance)
          {
               return sendErrorResponse(res,[],"Product not found",500);
          }
          const deletion_data={deletedAt:1}
          const deleted_product=await productServices.updateProductById(deletion_data,id);
          if(!deleted_product)
          {
               return sendErrorResponse(res,[],"Unable to update product",500)
          }
          return sendSuccessResponse(res,[],"Product deleted Successfully",200)
     }
     catch(err)
     {
          return sendSuccessResponse(res,[],"Unable to delete Product: "+err.message,500)
     }
}
module.exports={
     createProduct,
     getAllProducts,
     getProductByCode,
     getProductById,
     updateProductById,
     deleteProductById
}
