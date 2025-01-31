const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config(); //This can also be run as require("dotenv").config(); instead of const dotenv as variable.
const postRoute = require("./route/user.route");
const userRoute = require("./route/user.route");

const app = express();
app.use(express.json());
app.use(cookieParser());

// const{} = process.env is used for storing multiple strings without calling process.env
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

app.use(userRoute);
app.use(postRoute);

app.listen(5000, () => {
  console.log("app is running on port: 5000 ");
});
