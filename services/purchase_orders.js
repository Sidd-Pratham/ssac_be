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
module.exports={createBulkPurchaseOrders,deleteBulkPurchaseOrders};