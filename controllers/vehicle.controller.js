async function createVehicle(req,res){
     try{
          console.log('This function will create vehicle');
          res.send({
               "message":'This function will create vehicle'
          })
     }
     catch(err){
          console.log("Error creating vehicle",err)
     }
}

module.exports={
createVehicle
}