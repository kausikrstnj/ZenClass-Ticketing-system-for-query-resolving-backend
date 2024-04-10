const express = require("express");
const userController = require("../controllers/userController");
const authenticateToken = require("../authenticateToken");

const router = express.Router();

//To get all users
router
  .route("/api/users")
  .get(authenticateToken, userController.list)
  .post(userController.create);

//profile
router
  .route("/api/users/:userId")
  .get(userController.read)
  .put(userController.update)
  .delete(userController.remove);

//To view a profile
router
  .route("/api/users/profile/:userId")
  .get(userController.profileData)

//To save reset token in DB
router
  .route("/api/resetToken")
  .put(userController.randomNumber);

//Verify email
router
  .route("/api/verifyEmail/:userId")
  .post(userController.verifyEmail)

//Change password
router
  .route("/api/changePassword/:userId")
  .put(userController.changePassword)
module.exports = router;
