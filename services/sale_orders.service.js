const { where } = require("sequelize");
const { sequelize,sale_orders,products } = require("../models")

async function createBulkSaleOrders(sale_orders_details,bill_id,transaction){
     try{
          const saleOrdersWithBillId = sale_orders_details.map((order) => ({
               ...order,
               bill_id: bill_id, 
           }));
          const createdSaleOrders = await sale_orders.bulkCreate(saleOrdersWithBillId, { transaction });
          const updatePromises = saleOrdersWithBillId.map((order) =>
               products.update(
                 {
                   quantity: sequelize.literal(`quantity - ${order.product_quantity}`),
                 },
                 {
                   where: {
                     id: order.product_id,
                   },
                   transaction,
                 }
               )
             );
          await Promise.all(updatePromises);
          return createdSaleOrders;
     }
     catch(err)
     {
          throw err;
     }
}
async function deleteBulkSaleOrders(bill_id,transaction) {
     try{
          const orders=await sale_orders.findAll({
               where:{bill_id:bill_id}
          })
          const updatePromises = orders.map((order) =>
               products.update(
                 {
                   quantity: sequelize.literal(`quantity + ${order.product_quantity}`),
                 },
                 {
                   where: {
                     id: order.product_id,
                   },
                   transaction,
                 }
               )
             );
          await Promise.all(updatePromises);
          await sale_orders.destroy({
               where: {
                 bill_id: bill_id,
               },
               transaction, 
             });
          return;
     }catch(err)
     {
          throw err
     }
}
async function createSaleOrder(sale_order_data){
  const transaction=await sequelize.transaction();
  try{
    const sale_order=await sale_orders.create(sale_order_data,{transaction});
    await products.update(
      {quantity: sequelize.literal(`quantity - ${sale_order_data.product_quantity}`)},
      {
      where: {
        id: sale_order_data.product_id,
      },
      transaction,
    });
    await transaction.commit();
    return sale_order;
  }catch(err)
  {
    await transaction.rollback();
    throw err;
  }
}
async function deleteSaleOrderById(id)
{
  const transaction=await sequelize.transaction();
  try{
    const sale_order=await sale_orders.findByPk(id);
    const product_quantity=sale_order.product_quantity;
    const product_id=sale_order.product_id;
    await products.update(
      {
        quantity: sequelize.literal(`quantity + ${product_quantity}`),
      },{
        where: {
          id:product_id,
        },
        transaction,
      }
    )
    await sale_orders.destroy({
      where: {
        id: id,
      },
      transaction, 
    });
    await transaction.commit();
    return;
  }catch(err)
  {
      throw err;
  }
}
async function updateSaleOrderById(sale_order_data,id) {
    const transaction=await sequelize.transaction();
    try{
      const sale_order=await sale_orders.findByPk(id);
      const product_quantity=sale_order.product_quantity;
      const product_id=sale_order.product_id;
      await products.update(
        {
          quantity: sequelize.literal(`quantity + ${product_quantity} - ${sale_order_data.product_quantity}`),
        },{
          where: {
            id:product_id,
          },
          transaction,
        }
      )
      await sale_orders.update(sale_order_data,{where:{id:id},transaction});
      await transaction.commit();
      const updated_sale_order=await sale_orders.findByPk(id);
      return updated_sale_order;
    }catch(err)
    {
      await transaction.rollback();
      throw err;
    }
}
module.exports={
     createBulkSaleOrders,
     deleteBulkSaleOrders,
     createSaleOrder,
     deleteSaleOrderById,
     updateSaleOrderById
}