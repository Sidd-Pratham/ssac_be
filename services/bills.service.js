const { where } = require("sequelize");
const { sequelize,bills,sale_orders,products } = require("../models")
const saleOrdersService=require("./sale_orders.service");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function createBill(bill_details,sale_orders_details) {
     const transaction=await sequelize.transaction();
     try{
          const bill=await bills.create(bill_details,{transaction});
          const bill_id=bill.id;
          await saleOrdersService.createBulkSaleOrders(sale_orders_details,bill_id,transaction);
          await transaction.commit();

          const generated_bill=await bills.findOne(
              { 
               where:{id:bill_id},
               include:[
                    {
                      model: sale_orders,
                      as: 'saleOrders',  
                      include:[
                         {
                              model: products,
                              as: 'productDetails', 
                         }
                      ]
                    },
                  ],
          }
          );
          return generated_bill;
     }
     catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}
async function getAllBills(query,status,date,product_id) {
     try{
          let whereClause={deletedAt:0};
          let productWhereClause={};
          if(query){
               whereClause={
                    [Op.or]:[{consumer_contact:{[Op.like]:`%${query}%`}},]
               }
               // productWhereClause={
               //      [Op.or]:[{product_code:{[Op.like]:`%${query}%`}},
               //               {name:{[Op.like]:`%${query}%`}}
               // ]
               // }
          }
          if(status)
          {
               whereClause={
                 ...whereClause,
                 payment_status:status
               }
          }
          if(date)
          {
               whereClause={
                    ...whereClause,
                    billing_date:{
                         [Op.between]: [
                           new Date(`${date}T00:00:00.000Z`), // Start of the day
                           new Date(`${date}T23:59:59.999Z`)  // End of the day
                         ],
                       },  
                  }
          }
          if(product_id)
          {
               productWhereClause={
                    ...productWhereClause,
                    id:product_id
               }
          }
          const fetched_bills=await bills.findAll({
               where:whereClause,
               include:
               [{
                    model: sale_orders,
                    as: 'saleOrders',  
                    include:[
                       {
                            model: products,
                            as: 'productDetails',
                            required:true,
                            where:productWhereClause
                       }
                    ],
                    required:true
                  }],
               order: [['billing_date', 'DESC']]
          });
          return fetched_bills;
     }
     catch(err)
     {
          throw err;
     }
}
async function getBillById(id)
{
     try{
          const bill=await bills.findOne({
               where:{
                    id:id,
                    deletedAt:0
               },
                    include:
                    [{
                         model: sale_orders,
                         as: 'saleOrders',  
                         include:[
                            {
                              model: products,
                              as: 'productDetails',
                            }
                         ]
                       }],
          });
          return bill;
     }catch(err)
     {
          throw err;
     }
}
async function updateBillById(bill_details,id)
{
     const transaction=await sequelize.transaction();
     try{
          await bills.update(bill_details,{where:{id:id},transaction});
          await transaction.commit();
          const updated_bill=await getBillById(id);
          return updated_bill;
          
     }catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}
async function deleteBillById(id) {
     const transaction=await sequelize.transaction();
     try{
          const bill_details={deletedAt:1}
          await saleOrdersService.deleteBulkSaleOrders(id,transaction);
          await bills.update(bill_details,{where:{id:id},transaction});
          await transaction.commit();
     }
     catch(err)
     {    
          await transaction.rollback();
          throw err;
     }
}

module.exports={createBill,getAllBills,getBillById,updateBillById,deleteBillById}