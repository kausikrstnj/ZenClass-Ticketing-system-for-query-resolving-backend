const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const create = async (req, res) => {
  try {
    const { name, email, password, role, phn } = req.body;
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Create a new user
    user = new User({ name, email, password, role, phn });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
};
const list = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    res.json(users);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const read = async (req, res) => {
  try {
    const userId = req.params.userId;
    let user = await User.findById(userId);
    if (!user)
      return res.status(400).json({
        error: "User not found",
      });
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
const update = async (req, res) => {
  try {
    const { name, email, phn, updated = Date.now() } = req.body;
    await User.findByIdAndUpdate(req.params.userId, { name, email, phn, updated });
    res.status(201).json({ message: "Profile successfully updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const remove = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({
      message: "Successfully deleted!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const profileData = async (req, res) => {
  try {
    const userId = req.params.userId;
    let user = await User.find({ _id: userId });
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const randomNumber = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const randomNumber = await bcrypt.hash(req.body.randomNumber.toString(), salt);
    const usersWithName = await User.find({ email: req.body.mailId }).select('_id');
    if (!usersWithName) {
      res.status(500).json({ msg: "The Email you have provided is not registered." });
    }
    const userId = usersWithName[0]._id.toString();
    await User.findByIdAndUpdate(userId, { resetToken: randomNumber });
    res.status(201).json({ userId: userId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
};

const verifyEmail = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
    let user = await User.findOne({ _id: userId });
    const isMath = await bcrypt.compare(data.code, user.resetToken);
    if (!isMath) {
      return res
        .status(400)
        .json({ msg: "Invalid verification code." });
    }
    res.status(201).json({ userId });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const changePassword = async (req, res) => {
  try {
    const password = req.body.password;
    const userId = req.params.userId;
    const salt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash(password, salt);
    let user = await User.findOne({ _id: userId });
    user = await User.findByIdAndUpdate(user._id, { password: userPassword });
    res.status(201).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
};

module.exports = { create, list, read, update, remove, profileData, randomNumber, verifyEmail, changePassword };
