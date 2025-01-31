const express = require("express");
const authorisation = require("../middleware/authorisation")
const route = express.Router();
const {createPost, getAllPost, getOnePost, updatePost, deletePost} = require("../controller/post.controller");

route.post("/posts", authorisation, createPost);
route.get("/posts", getAllPost);
route.get("/posts/:id", getOnePost)
route.put("/posts/:id", authorisation, updatePost)
route.delete("/posts/:id",authorisation, deletePost)





module.exports = route;
