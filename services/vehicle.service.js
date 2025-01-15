const { where } = require("sequelize");
const {sequelize,vehicles}= require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function createVehicle(vehicle_data) {
     const transaction = await sequelize.transaction();
     try
     {
          const new_vehicle=await vehicles.create(vehicle_data,{transaction});
          await transaction.commit();
          return new_vehicle;
     }
     catch(err)
     {
          await transaction.rollback()
          throw err;
     }
}
async function getAllVehicles(query){
     try{
          let whereClause={};
          if(query){
               whereClause={
                    [Op.or]:[
                    {name:{[Op.like]:`%${query}%`}},
                    {brand_name:{[Op.like]:`%${query}%`}}
                    ]
               }
          }
          const vehicleDetails=await vehicles.findAll({
               where: { ...whereClause, deletedAt: 0 },
          });
          return vehicleDetails;
     }catch(err)
     {
          console.log("ERROR(GETALLVEHICLES):",err.message);
          throw err;
     }
}
async function getVehiclebyId(id)
{
     try
     { 
          const vehicleDetails=await vehicles.findOne({
               where:{
                    id:id,
                    deletedAt:0
               }
          });
          return vehicleDetails;
     }
     catch(err)
     {
          console.log("ERROR(GETAVEHICLESBYID):",err.message);
          throw err;
     }
}
async function updateVehicleById(vehicle_data,id) {
     const transaction= await sequelize.transaction();
     try{
          const updated_vehicle=await vehicles.update(vehicle_data,{where:{id},transaction});
          await transaction.commit();
          const updatedVehicle = await vehicles.findOne({ where: { id } });
          return updatedVehicle;
     }
     catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}
module.exports={createVehicle,getAllVehicles,getVehiclebyId,updateVehicleById}