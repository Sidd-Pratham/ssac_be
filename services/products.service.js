const { sequelize,products,vehicles,vehicle_models } = require("../models");
const Sequelize = require("sequelize");
const { sendSuccessResponse } = require("../utils/response");
const Op = Sequelize.Op;
async function createProduct(product_details,associatedVehicles,associatedModels) {
     const transaction=await sequelize.transaction();
     try{
          const new_product=await products.create(product_details,{transaction});
          console.log(new_product instanceof products); // Should print `true`
          if (associatedVehicles && associatedVehicles.length > 0) {
               await new_product.addVehicles(associatedVehicles, { transaction });
             }
          if (associatedModels && associatedModels.length > 0) {
               await new_product.addVehicle_models(associatedModels, { transaction });
             }
          await transaction.commit();
          return new_product;
     }catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}
async function getAllProducts(query,category,vehicle_id,vehicle_model_id) {
     try{
          let whereClause={deletedAt:0};
          let includeClause=[];
          if(vehicle_id)
          {
               includeClause.push({
                    model: vehicles,
                    attributes: ["name", "brand_name"],
                    where: { id: vehicle_id },
                });
          }
          if(vehicle_model_id)
          {
               includeClause.push({
                    model: vehicle_models,
                    attributes: ["name", "year"],
                    where: { id: vehicle_model_id },
                });
          }
          if(query)
          {
               whereClause={
                    ...whereClause,
                    [Op.or]:[
                    {name:{[Op.like]:`%${query}%`}},
                    {manufacturer_name:{[Op.like]:`%${query}%`}},
                    {product_code:{[Op.like]:`%${query}%`}},
                    {category:{[Op.like]:`%${query}%`}},
                    ]
               }
          }
          if(category)
          {
               whereClause={
                    ...whereClause,
                    category:category
               }
          }

          const fetched_products=await products.findAll({
               where:whereClause,
               include:includeClause
          })
          return fetched_products;
     }catch(err)
     {
          throw err;
     }
}
async function getProductByCode(code) {
     try{
          const product_details=await products.findOne({
               where:{product_code:code,deletedAt:0}
          })
          return product_details;
     }catch(err)
     {
          throw err;
     }
}
async function getProductById(id){
     try{
          const product_details=await products.findOne({
               where:{
                    id:id,
                    deletedAt:0
               },
               include:[
                    {
                         model:vehicles,
                         attributes: ["name", "brand_name"],
                    },
                    {
                         model:vehicle_models,
                         attributes: ["name", "year"],
                    }
               ]
          })
          return product_details;
     }catch(err)
     {
          throw err;
     }
}
async function updateProductById(product_details,id,associatedVehicles=null,associatedModels=null) {
     const transaction=await sequelize.transaction()
     try{
          await products.update(product_details,{where:{id},transaction});
          const product = await products.findByPk(id);
          if (!product) { return null; }

          if(associatedVehicles)
          {
               await product.setVehicles([],{transaction});
               if (associatedVehicles && associatedVehicles.length > 0) {
                    await product.addVehicles(associatedVehicles, { transaction });
                  }
          }
          if(associatedModels)
          {
               await product.setVehicle_models([], { transaction });
               if (associatedModels && associatedModels.length > 0) {
                    await product.addVehicle_models(associatedModels, { transaction });
                  }
          }
          await transaction.commit();
          return product;
     }catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}


module.exports={
     createProduct,
     getAllProducts,
     getProductByCode,
     getProductById,
     updateProductById,
}