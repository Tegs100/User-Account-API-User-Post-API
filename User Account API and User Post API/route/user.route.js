const express = require("express");
const route = express.Router();
const {createUser, loginUser, deleteUser, getOneUser, updateUser} = require("../controller/user.controller")

route.post("/user", createUser);
route.post("/login", loginUser);
route.get("/user/:id", getOneUser)
route.delete("/user/:id", deleteUser)
route.put("/user/:id", updateUser)

module.exports = route;


