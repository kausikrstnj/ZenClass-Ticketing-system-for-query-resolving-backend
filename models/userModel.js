const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: "Name is required" },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
    required: "Name is required",
  },
  phone: { type: Number, trim: true },
  created: { type: Date, default: Date.now },
  role: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("User", userSchema);
