const { where, Model } = require("sequelize");
const {sequelize,shipments,purchase_orders,products} = require("../models")
const purchaseOrdersService=require("../services/purchase_orders");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
async function createShipment(shipment_details,purchase_order_details) {
     const transaction=await sequelize.transaction();
     try{
          const shipment=await shipments.create(shipment_details,{transaction});
          const shipment_id=shipment.id;
          await purchaseOrdersService.createBulkPurchaseOrders(purchase_order_details,shipment.id,transaction);
          await transaction.commit();
          let generated_shipment={}
               generated_shipment=await shipments.findOne({
                    where:{
                         id:shipment_id
                    },
                    include:
                         {
                              model:purchase_orders,
                              as:"purchaseOrders",
                              include:{
                                   model:products,
                                   as:"productDetails"
                              }
                         }
               })
          return generated_shipment;
     }catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}
async function getAllShipments(query,supplier_id,status,firm_associated,tentative_payment_date,payment_date,product_id) {
     try{
          let whereClause={deletedAt:0};
          let productWhereClause={};
          if(query)
          {
               whereClause={
                    [Op.or]:[{payment_details:{[Op.like]:`%${query}%`}},]
               }
          }
          if(supplier_id)
          {
               whereClause={
                    ...whereClause,
                    supplier_id:supplier_id}
          }
          if(status)
          {
               whereClause={
                    ...whereClause,
                    status:status}
          }
          if(firm_associated)
          {
               whereClause={
                    ...whereClause,
                    firm_associated:firm_associated
               }
          }
          if(tentative_payment_date)
          {
               whereClause={
                    ...whereClause,
                    tentative_payment_date:{
                         [Op.between]: [
                           new Date(`${tentative_payment_date}T00:00:00.000Z`), 
                           new Date(`${tentative_payment_date}T23:59:59.999Z`)
                         ],
                       },  
               }
          }
          if(payment_date)
          {
               whereClause={
                    ...whereClause,
                    payment_date:{
                         [Op.between]: [
                           new Date(`${payment_date}T00:00:00.000Z`), 
                           new Date(`${payment_date}T23:59:59.999Z`)
                         ],
                       },  
               }
          }
          if(product_id)
          {
               productWhereClause={
                    id:product_id
               }
          }
          const fetched_shipment=await shipments.findAll({
               where:whereClause,
               include:[{
                    model: purchase_orders,
                    as: 'purchaseOrders',  
                    required:true,
                    include:[
                       {
                            model: products,
                            as: 'productDetails',
                            required:true,
                            where:productWhereClause
                       }
                    ]
                  }],
          });
          return fetched_shipment;
     }catch(err)
     {
          throw err;
     }
}
async function getShipmentById(id) {
     try{
          const fetched_shipment=shipments.findOne({
               where:{
                    id:id,
                    deletedAt:0
               },
               include:
                         {
                              model:purchase_orders,
                              as:"purchaseOrders",
                              include:{
                                   model:products,
                                   as:"productDetails"
                              }
                         }
          });
         return fetched_shipment;
     }catch(err)
     {
          throw err;
     }
}
async function updateShipmentById(shipment_details,id) {
     const transaction=await sequelize.transaction()
     try{
          await shipments.update(shipment_details,{where:{id:id},transaction});
          await transaction.commit();
          const updated_shipment=await getShipmentById(id);
          return updated_shipment;
     }catch(err)
     {
          await transaction.rollback()
          throw err;
     }
}
async function deleteShipmentById(id) {
     const transaction=await sequelize.transaction();
     try{
          const shipment_details={deletedAt:1}
          await purchaseOrdersService.deleteBulkPurchaseOrders(id,transaction);
          await shipments.update(shipment_details,{where:{id:id},transaction});
          await transaction.commit();
     }catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}
module.exports={createShipment,getAllShipments,getShipmentById,updateShipmentById,deleteShipmentById}