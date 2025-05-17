const express = require("express");
const paperController = require("../controllers/paperController");
const router = express.Router();
console.log("PaperRoutes----------------");
// To create a new paper
router
    .route("/api/addNewPaper")
    .post(paperController.createPaper);

// To create a new staff
router
    .route("/api/addNewStaff")
    .post(paperController.createStaff);

// To schedule a class
router
    .route("/api/scheduleClass")
    .post(paperController.scheduleClass);

//To get all papers
router
    .route("/api/getAllPapers")
    .get(paperController.getAllPapers);

//To get all Staffs
router
    .route("/api/getAllStaffs")
    .get(paperController.getAllStaffs);

//To get all Scheduled Classes
router
    .route("/api/getAllScheduledClasses")
    .get(paperController.getAllScheduledClasses);

module.exports = router;
