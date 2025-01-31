const postModel = require("../model/post.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const createPost = async (req, res) => {
  const id = req.user
  const body = req.body;
  try {
    const post = new postModel({...body, creatorId:id});
    await post.save();
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" });
  }
};

const getAllPost = async (req, res) => {
  try {
    const allPost = await postModel.find();
    res.json(allPost);
  } catch (error) {
    res.status(400).json({ message: "Cannot get posts" });
  }
};

const getOnePost = async (req, res) => {
  const { id } = req.params;
  console.log({ id });
  try {
    const onePost = await postModel.findById(id);
    res.json(onePost);
  } catch (error) {
    res.status(400).json({ message: "Cannot get post" });
  }
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user
  const { id: postId, ...others} = req.body
  try {
    const updatedPost = await postModel.findById(id);
    if(!updatedPost) {
      return res.json({message: "post does not exist"})
    }
    if(updatedPost.creatorId != user){
      return res.json ({message: "you are not the owner of the post"})
    }
    //now we update the post
    await postModel.findByIdAndUpdate(id, {...others}, {new: true});
    res.status(201).json({ message: "post updated successfully"});
  } catch (error) {
    res.status(400).json({ message: "Cannot update post"});
  }
};
const deletePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user
  try {
    const deletedPost = await postModel.findById(id);
    if(!deletedPost) {
      return res.status(404).json({message: "Post not found"})
    }
    if (deletedPost.creatorId.toString() != user){
      return res.status(403).json({message: "You are not permitted to delete this post"});
}
await postModel.findByIdAndDelete(id);
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Cannot delete post" });
  }
};
module.exports = {
  createPost,
  getAllPost,
  getOnePost,
  updatePost,
  deletePost,
};
