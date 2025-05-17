const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/api/signup").post(authController.signup);
router.route("/api/auth/login").post(authController.signin);

module.exports = router;
