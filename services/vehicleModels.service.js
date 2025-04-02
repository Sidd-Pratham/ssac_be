const { sequelize,vehicle_models,vehicles } = require("../models")
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
    let whereClause = { deletedAt: 0 };
    let vehicleWhereClause = {};

    if (query) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { year: { [Op.like]: `%${query}%` } },
        ],
      };

      vehicleWhereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { brand_name: { [Op.like]: `%${query}%` } },
        ],
      };
    }

    if (vehicle_id) {
      whereClause={
        ...whereClause,
        vehicle_id:Number(vehicle_id)
      }
      const ModelOnlySearch=await vehicle_models.findAll({
        where:whereClause,
        include:{
          model: vehicles,
          as: "vehicleDetails",
        }
      })
      return ModelOnlySearch;
    }

    // Query 1: Search directly in vehicle_models
    const modelsResult = await vehicle_models.findAll({
      where: whereClause,
      include: [
        {
          model: vehicles,
          as: "vehicleDetails",
          required: false,
        },
      ],
    });
    // Query 2: Search in vehicles and fetch related vehicle_models
    const vehiclesResult = await vehicle_models.findAll({
      where:{deletedAt:0},
      include: [
        {
          model: vehicles,
          as: "vehicleDetails",
          required: true,
          where: vehicleWhereClause,
        },
      ],
    });
    // Merge and remove duplicates
    const combinedResults = [...modelsResult, ...vehiclesResult].reduce((acc, item) => {
      if (!acc.find((x) => x.id === item.id)) {
        acc.push(item);
      }
      return acc;
    }, []);

    return combinedResults;
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