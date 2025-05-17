const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const config = require("../../config/config");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password, role = "admin" } = req.body;
    //console.log("Req.body----", req.body);
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Create a new user
    user = new User({ name, email, password, role });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Error-- ", error.message);
    res.status(500).send("server error");
  }
};

const signin = async (req, res) => {
  try {
    console.log("🔥 Login endpoint hit");
    console.log("Request body:", req.body);
    const { email, password } = req.body;
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found");
      return res.status(400).json({ msg: "Email or password is incorrect." });
    }
    //Validate password
    const isMath = await bcrypt.compare(password, user.password);
    if (!isMath) {
      console.log("❌ Invalid password");
      return res.status(400).json({ msg: "Email or password is incorrect." });
    }
    //Generate JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: "admin",
        hash: user.password,
        role: user.role,
      },
    };
    jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      console.log("✅ Token generated");
      res.json({ token, userId: user.id, role: user.role, userName: user.name, userEmail: user.email });
    });
  } catch (error) {
    console.error("🔥 Error in login:", error.message);
    // console.error(error.message);
    res.status(500).send("server error");
  }
};

const signout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "signed out",
    });
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
    // console.log('changePassword/userPassword -', userPassword);
    // await User.findByIdAndUpdate(userId, { password: userPassword });
    // res.status(201).json({ msg: "Password updated successfully" });

    let user = await User.findOne({ _id: userId });

    user = await User.findByIdAndUpdate(user._id, { password: userPassword });

    res.status(201).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
};

module.exports = { signup, signin, signout, changePassword };
