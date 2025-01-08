const express=require('express');
const app=express();
const dotenv=require("dotenv");
dotenv.config();

app.get("/",(req,res)=>{
     res.send({
          "message":"Welcome to backend system of SSAC management system"
     })
});

const routes=require("./routes/central");
app.use("/api",routes);

const sequelize=require('./database/database');
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
  });

const port=process.env.PORT || 2127;
app.listen(port,()=>{
     console.log(`Server running at port:${port}`);
})