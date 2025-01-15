const vehicleModelsServices=require("../services/vehicleModels.service");
const {sendSuccessResponse,sendErrorResponse}=require("../utils/response");
const {vehicle_models,vehicles}=require("../models");
const { where } = require("sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
async function createVehicleModel(req,res) {
     try{
          const model_data={
               vehicle_id:req.query.vehicle_id,
               name:req.query.name,
               year:req.query.year
          }

          const check_vehicle=await vehicles.findOne({
               where:{
                    id:model_data.vehicle_id,
                    deletedAt:0
               }
          });
          if(!check_vehicle)
          {
               return sendErrorResponse(res,[],"Invalid Vehicle Details(Id)",500);
          }
          const check_similar_model=await vehicle_models.findOne({
               where:{
                    name:model_data.name,
                    vehicle_id:model_data.vehicle_id,
                    deletedAt:0
               }
          })
          if(check_similar_model)
          {
               return sendErrorResponse(res,[],"Similar model already exists",500);
          }
          const new_model=await vehicleModelsServices.createVehicleModel(model_data);
          return sendSuccessResponse(res,new_model,"New model created Successfully",200);
     }
     catch(err)
     {
          return sendErrorResponse(res,[],"Unable to create model: "+ err.message,200)
     }
}
async function getAllModels(req,res) {
     try{
          const query=req.query.query ?? null;
          const vehicle_id=req.query.vehicle_id ?? null;
          const fetched_models=await vehicleModelsServices.getAllModels(query,vehicle_id);
          return sendSuccessResponse(res,fetched_models,"Model(s) found successfully",200)
     }catch(err)
     {
          return sendErrorResponse(res,[],"Issue fetching Models: "+err.message,500);
     }
}
async function getModelById(req,res) {
     try{
          const id=req.params.id;
          const model=await vehicleModelsServices.getModelById(id);
          if(!model)
          {
               return sendErrorResponse(res,[],"No data found",404);
          }
          return sendSuccessResponse(res,model,"Model found Successfully",200);
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to get Model: "+err.message,500)
     }
}
async function updateModelById(req,res) {
     try{
          const id=req.params.id;
          const model_data={
               vehicle_id:req.query.vehicle_id,
               name:req.query.name,
               year:req.query.year
          }
          const check_model_existance=await vehicleModelsServices.getModelById(id);
          if(!check_model_existance)
          {
               return sendErrorResponse(res,[],"Model not found",200);
          }
          const check_duplicacy=await vehicle_models.findOne({
               where:{
                    name:model_data.name,
                    vehicle_id:model_data.vehicle_id,
                    deletedAt:0,
                    id:{[Op.ne]:id}
               }
          })
          console.log("check_duplicacy",check_duplicacy);
          if(check_duplicacy)
          {
               return sendErrorResponse(res,[],"Similar model for selected vehicle already exists",500);     
          }
          const updatedModel=await vehicleModelsServices.updateModelById(model_data,id);
          return sendSuccessResponse(res,updatedModel,"Model updated successfully",200);
     }
     catch(err)
     {
          return sendErrorResponse(res,[],"Unable to update vehicle model: "+err.message,500)
     }
}
async function deleteInterviewById(req,res) {
     try{
          const id=req.params.id;
          const check_existance=await vehicle_models.findOne({
               where:{
                    id:id
               }
          });
          if(!check_existance)
          {
               res.sendErrorResponse(res,[],"Vehicle model not found",404);
          }
          const model_data={deletedAt:1};
          const deleted_model=await vehicleModelsServices.updateModelById(model_data,id);
          return sendSuccessResponse(res,deleted_model,"Vehicle model deleted successfully",200);

     }catch(err)
     {
          return sendErrorResponse(res,"Issue deleting vehicle model: ",err.message,500)
     }
}
module.exports={createVehicleModel,getAllModels,getModelById,updateModelById,deleteInterviewById}