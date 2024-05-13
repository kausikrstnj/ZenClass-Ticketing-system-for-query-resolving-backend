const express = require("express");
const queryController = require("../controllers/queryController");
const authenticateToken = require("../authenticateToken");
const router = express.Router();

// To create a query
router
    .route("/api/createQuery")
    .post(queryController.create);

//to view all queries    
router
    .route("/api/queries/:userId/:role")
    .get(queryController.list)

//to view filtered queries    
router
    .route("/api/queries/:userId/:role/:filterCriteria")
    .get(queryController.filteredQuery)

//To view query
router
    .route("/api/query/:queryId")
    .get(queryController.view)

//To get all mentors
router
    .route("/api/mentors")
    .get(queryController.getMentors)


//Assign Mentor for a query
router
    .route("/api/assignMentor/:mentorId/:queryId")
    .put(queryController.assignMentor)

//To close query by mentor
router
    .route("/api/closeQuery/:queryId")
    .put(queryController.closeQuery)

//To all assigned queries
router
    .route("/api/getAllAssignedQueries")
    .get(queryController.getAllAssignedQueries)

module.exports = router;
