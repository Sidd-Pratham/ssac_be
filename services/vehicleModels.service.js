const { sequelize,vehicle_models } = require("../models")
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
async function createVehicleModel(model_data) {
     const transaction=await sequelize.transaction();
     try{
          const new_model= await vehicle_models.create(model_data,{transaction});
          await transaction.commit();
          return new_model;
     }catch(err)
     {    
          await transaction.rollback();
          throw err;
     }
}

async function getAllModels(query,vehicle_id) {
     try{
          let whereClause={};
          if(query)
          {
               whereClause={
                    [Op.or]:[
                         {name:{[Op.like]:`%${query}%`}},
                         {year:{[Op.like]:`%${query}%`}}
                    ]
               }
          }
          if(vehicle_id)
          {
               whereClause={
                    ...whereClause,
                    vehicle_id:vehicle_id
               }
          }
          const fetched_models=await vehicle_models.findAll({
               where:{...whereClause,deletedAt:0}
          })
          return fetched_models;
     }
     catch(err)
     {
          throw err;
     }
}
async function getModelById(id) {
     try{
          const model=await vehicle_models.findOne({
               where:{
                    id:id,
                    deletedAt:0
               }
          });
          return model;
     }catch(err)
     {
          throw err;
     }
}
async function updateModelById(model_data,id) {
     const transaction=await sequelize.transaction();
     try{
          const updated_vehicle_model=await vehicle_models.update(model_data,{where:{id},transaction});
          await transaction.commit();
          const updatedVehicleModel = await vehicle_models.findOne({ where: { id } });
          return updatedVehicleModel;
     }catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}
module.exports={createVehicleModel,getAllModels,getModelById,updateModelById}