const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Create a User function
const createUser = async (req, res) => {
  const { password, ...others } = req.body;
  //salt the password
  const salt = bcrypt.genSaltSync(10);
  //hash the password
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log(hashedPassword);
  //validating user credentials: using email
  const validateUser = await userModel.findOne({ email: others.email });
  console.log(validateUser);
  if (validateUser) {
    return res.status(400).json({ message: "User already exist" });
  }
  // create new user
  try {
    const newUser = new userModel({ password: hashedPassword, ...others });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("cannot registry, try again");
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // check for email and password
  if (!email || !password) {
    return res.status(400).json({ message: "invalid details" });
  }
  //check for user email exist.
  const checkUser = await userModel.findOne({ email });
  if (!checkUser) {
    return res.status(404).json({ message: "User not found" });
  }
  //check if password is correct
  const checkPassword = bcrypt.compareSync(password, checkUser.password);
  if (!checkPassword) {
    return res.status(401).json({ message: "invalid password" });
  }
  // create jwt token
  const token = jwt.sign({id: checkUser.id}, process.env.JWT_SECRET)
  // return information to the frontend
  return res
    .cookie("token", token, { httpOnly: true })
    .status(200)
    .json(checkUser);
};

// Get a single user
const getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Cannot get user" });
  }
};


// delete user
const deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await userModel.findByIdAndDelete(id);
    res.status(201).send("user deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

//update user
const updateUser = async (req, res) => {
  const { id, name, email } = req.body;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!updatedUser){
      return res.status(404).json({message: "User not found"})
    }
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: "Unable to update" });
  }
};

module.exports = { createUser, loginUser, deleteUser, getOneUser, updateUser };
