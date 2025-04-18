const express=require('express');
const app=express();
app.use(express.json());
const dotenv=require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);
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