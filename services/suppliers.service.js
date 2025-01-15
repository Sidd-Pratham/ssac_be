const { sequelize,suppliers } = require("../models")
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function createSupplier(supplier_data) {
     const transaction=await sequelize.transaction()
     try{
       const new_supplier=await suppliers.create(supplier_data);
       await transaction.commit();
       return new_supplier;
     }catch(err)
     {
          await transaction.rollback();
          throw err;
     }
}
async function getAllSuppliers(query) {
     try{
          let whereClause={}
          if(query)
               {
                    whereClause={
                         [Op.or]:[   
                         {name:{[Op.like]:`%${query}%`}},
                         {contact_number:{[Op.like]:`%${query}%`}},
                         {address:{[Op.like]:`%${query}%`}},
                         {sales_person_name:{[Op.like]:`%${query}%`}},
                         {sales_person_contact_number:{[Op.like]:`%${query}%`}},
                         {bank_account_number:{[Op.like]:`%${query}%`}},
                         {bank_branch_name:{[Op.like]:`%${query}%`}},
                         {bank_branch_ifsc:{[Op.like]:`%${query}%`}},
                         {supplier_gst_number:{[Op.like]:`%${query}%`}},
                    ]
                    }
               }
          const fetched_data=await suppliers.findAll({
               where:{...whereClause,deletedAt:0}
          })
          return fetched_data;
     }
     catch(err)
     {
          throw err;
     }
}
async function getSupplierById(id) {
     try{
          const supplier=await suppliers.findOne({
               where:{
                    id:id,
                    deletedAt:0
               }
          })
          return supplier;
     }catch(err)
     {
          throw err;
     }
}
async function updateSupplierById(supplier_data,id) {
     const transaction=await sequelize.transaction();
     try{
          await suppliers.update(supplier_data,{where:{id},transaction});
          await transaction.commit();
          const updatedSupplier=suppliers.findOne({
               where:{id:id}
          });
        
          return updatedSupplier;
     }catch(err)
     {
          await transaction.rollback()
          throw err;
     }
}
module.exports={
     createSupplier,
     getAllSuppliers,
     getSupplierById,
     updateSupplierById
}