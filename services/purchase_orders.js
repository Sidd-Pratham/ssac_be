const { sequelize,products,purchase_orders } = require("../models")

async function createBulkPurchaseOrders(purchase_order_details,shipment_id,transaction) {
     try{
          const PurchaseOrdersWithShipmentId = purchase_order_details.map((order) => ({
               ...order,
               shipment_id: shipment_id, 
           }));
          const createdPurchaseOrders = await purchase_orders.bulkCreate(PurchaseOrdersWithShipmentId, { transaction });
          const updatePromises = createdPurchaseOrders.map((order) =>
               products.update(
                 {
                   avg_cost_price: sequelize.literal(`((avg_cost_price)*(quantity) + ${order.product_quantity}*${order.unit_price})/(quantity + ${order.product_quantity})`),
                   quantity: sequelize.literal(`quantity + ${order.product_quantity}`)
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
          return createdPurchaseOrders;
     }catch(err)
     {
          throw err;
     }
}
async function deleteBulkPurchaseOrders(shipment_id,transaction) {
     try{
          const orders=await purchase_orders.findAll({
               where:{shipment_id:shipment_id}
          })
          const updatePromises = orders.map((order) =>
               products.update(
                 {
                   avg_cost_price: sequelize.literal(`((avg_cost_price)*(quantity) - ${order.product_quantity}*${order.unit_price})/(quantity - ${order.product_quantity})`),
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
          await purchase_orders.destroy({
               where: {
                    shipment_id: shipment_id,
               },
               transaction, 
             });
          return;
     }catch(err)
     {
          throw err;
     }
}
async function createPurchaseOrders(purchase_order_details) {
     const transaction = await sequelize.transaction()
     try{
          const purchase_order= await purchase_orders.create(purchase_order_details,{transaction});
          await products.update(
               {
                    avg_cost_price: sequelize.literal(`((avg_cost_price)*(quantity) + ${purchase_order.product_quantity}*${purchase_order.unit_price})/(quantity + ${purchase_order.product_quantity})`),
                    quantity: sequelize.literal(`quantity + ${purchase_order.product_quantity}`)
               },
               {
                 where: {
                   id: purchase_order.product_id,
                 },
                 transaction,
               }
             )
          await transaction.commit();
          return purchase_order;
     }catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}

async function updatePurchaseOrderById(purchase_order_details,id) {
     const transaction=await sequelize.transaction();
    try{
      const purchase_order=await purchase_orders.findByPk(id);
      const product=await products.findByPk(purchase_order_details.product_id)
      const current_avg_price=product.avg_cost_price;
      const current_quantity=product.quantity;
      if (current_quantity - purchase_order.product_quantity <= 0) {
          throw new Error("Invalid quantity calculation: current stock is less than or equal to the removed quantity");
      }
      const old_avg_price=((current_avg_price*current_quantity) - (purchase_order.unit_price)*(purchase_order.product_quantity))/(current_quantity-purchase_order.product_quantity);
      console.log("old_avg_price",old_avg_price);
      const new_avg_price=((old_avg_price*(current_quantity-purchase_order.product_quantity)) + (purchase_order_details.unit_price)*(purchase_order_details.product_quantity))/(current_quantity-purchase_order.product_quantity + purchase_order_details.product_quantity)
      console.log("new_avg_price",new_avg_price);
      await products.update(
        {
          quantity: sequelize.literal(`quantity - ${purchase_order.product_quantity} + ${purchase_order_details.product_quantity}`),
          avg_cost_price: new_avg_price
        },{
          where: {
            id:purchase_order_details.product_id,
          },
          transaction,
        }
      )
      await purchase_orders.update(purchase_order_details,{where:{id:id},transaction});
      await transaction.commit();
      const updated_purchase_order=await purchase_orders.findByPk(id);
      return updated_purchase_order;
    }
    catch(err)
    {
      await transaction.rollback();
      throw err;
    }
}
module.exports={createBulkPurchaseOrders,deleteBulkPurchaseOrders,createPurchaseOrders,updatePurchaseOrderById};