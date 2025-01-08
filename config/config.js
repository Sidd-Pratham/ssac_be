require("dotenv").config();
module.exports = {
  environment: process.env.NODE_ENV,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DIALECT,
};