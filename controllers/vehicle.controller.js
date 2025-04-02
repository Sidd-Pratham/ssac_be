const {sendSuccessResponse} = require("../utils/response");
const {sendErrorResponse} = require("../utils/response")
const vehicleServices = require("../services/vehicle.service");
const Sequelize=require("sequelize");
const Op = Sequelize.Op;
const {
     sequelize,
     vehicle_models,
     vehicles
}=require("../models");
async function createVehicle(req,res){
     try{
          const vehicle_data={  
               name:req.body.name,
               brand_name:req.body.brand_name
          }
          const similar_vehicle=await vehicles.findOne({
               where:
               {
               name:vehicle_data.name,
               deletedAt:0
               }
          });
          if(similar_vehicle)
          {
               return sendErrorResponse(res,[],"Similar vehicle already Exists",500);
          }
          else
          {
               const new_vehicle=await vehicleServices.createVehicle(vehicle_data);
               return sendSuccessResponse(res,new_vehicle,"New vehicle Created Successfully",201)
          }
        
     }
     catch(err){
          console.log("Error creating vehicle:",err);
          return sendErrorResponse(res,[],"Error creating vehicle: "  +err.message,500)
     }
}
async function getVehiclebyId(req,res){
     try{
         const id=req.params.id
         const vehicleDetails=await vehicleServices.getVehiclebyId(id);
         if(!vehicleDetails)
         {
          return sendErrorResponse(res,[],"Vehicle not found",500)
         }
         return sendSuccessResponse(res,vehicleDetails,"Vehicle found Successfully",200)
     }catch(err){
          return sendErrorResponse(res,[],"Not able to get vehicle: "+err.message,500)
     }
}
async function getAllVehicles(req,res){
     try{
          const query=req.query.query;
          const vehiclesFetched=await vehicleServices.getAllVehicles(query);
          return sendSuccessResponse(res,vehiclesFetched,"vehicles found Successfully",200)
     }catch(err)
     {
          return sendErrorResponse(res,[],"Unable to get vehicles: ",err.message,500)
     }
}
async function updateVehicleById(req,res) {
     try{
          const id=req.params.id;
          const vehicle_data={
               name:req.body.name,
               brand_name:req.body.brand_name
          }
          const vehicle_non_deleted=await vehicles.findOne({
               where:{
                    deletedAt:0,
                    id:id
               }
          })
          if(!vehicle_non_deleted)
          {
               return sendErrorResponse(res,[],"Vehicle not found",500);
          }
          const similar_vehicle=await vehicles.findOne({
               where:{
                    name:vehicle_data.name,
                    deletedAt:0,
                    id:{[Op.ne]:id}
               }
          })
          if(similar_vehicle)
          {
               return sendErrorResponse(res,[],"Similar vehicle already exists",500);
          }
          else
          {
               const updatedVehicle=await vehicleServices.updateVehicleById(vehicle_data,id);
               return sendSuccessResponse(res,updatedVehicle,"Vehicle updated Successfully",200)
          }
     }
     catch(err)
     {
          return sendErrorResponse(res,[],"Unable to update vehicles: ",err.message,500)
     }
}
async function deleteVehicle(req,res) {
     try{
          const id=req.params.id;
          const vehicle_exists=await vehicles.findOne({
               where:{
                    id:id,
                    deletedAt:0
               }
          })
          if(!vehicle_exists)
          {
               return sendErrorResponse(res,[],"Issue deleting vehicle",500);
          }
          const check_model_existance=await vehicle_models.findOne({where:{vehicle_id:id,deletedAt:0}})
          if(check_model_existance)
          {
               return sendErrorResponse(res,[],"Model already Existing for this Vehicle",500);
          }
          const vehicle_data={deletedAt:1};
          const updatedVehicle=await vehicleServices.updateVehicleById(vehicle_data,id);
          return sendSuccessResponse(res,updatedVehicle,"Vehicle deleted Successfully",200)
     }
     catch(err)
     {
          return sendErrorResponse(res,[],"Unable to delete vehicles: "+err.message,500);
     }
}
module.exports={
createVehicle,
getVehiclebyId,
getAllVehicles,
updateVehicleById,
deleteVehicle
}