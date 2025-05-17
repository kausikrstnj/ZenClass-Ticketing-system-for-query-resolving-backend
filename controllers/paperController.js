const papers = require("../models/paperModel");
const User = require("../models/userModel");
const scheduledClass = require("../models/scheduleClassModel");
const multer = require('multer');
const mongoose = require('mongoose');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Save uploaded files in 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use the original file name
    }
});

const upload = multer({ storage: storage });

const createPaper = async (req, res) => {
    try {
        const { paperName, degree } = req.body;
        // Check if paper already exists
        const existingPaper = await papers.findOne({ paperName: paperName, Degree: degree });
        if (existingPaper) {
            return res.status(400).json({ message: `${paperName} already exists` });
        }
        // Create a new paper document
        const newPaper = new papers({
            paperName: paperName,
            assignedStaff: "",// Optional or get from frontend
            created: Date.now(),
            scheduleDate: "",
            Degree: degree,
        });
        await newPaper.save();
        return res.status(200).json({ message: "Paper saved successfully!" });
    } catch (error) {
        console.error("Error saving paper:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAllPapers = async (req, res) => {
    try {
        let paper = await papers.find();
        let staff = await User.find({ role: "staff" });
        // let degreeCount = await papers.findOne({ Degree });
        // Count degrees
        const degreeCount = await papers.aggregate([
            {
                $group: {
                    _id: "$Degree", // Group by Degree field
                    count: { $sum: 1 } // Count the number of occurrences of each degree
                }
            },
            {
                $sort: { count: -1 } // Optional: Sort the degrees by count in descending order
            }
        ]);
        res.status(200).json({ paper, staff, degreeCount });
    } catch (error) {
        return res.status(400).json({ error: error });
    }
};


const createStaff = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        // console.log("paperController--- createStaff-- ", req.body);
        // Check for existing user with the same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Staff already exists" });
        }
        // Create new staff user
        const newUser = new User({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            role: "staff"
        });
        await newUser.save();
        return res.status(200).json({ message: "Staff saved successfully!" });
    } catch (error) {
        console.error("Error saving staff:", error.message);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};



const getAllStaffs = async (req, res) => {
    try {
        const staffList = await User.find({ role: "staff" });
        res.status(200).json({ staffs: staffList });
    } catch (error) {
        console.error("Error fetching staffs:", error.message);
        res.status(400).json({ error: error.message });
    }
};

const getAllScheduledClasses = async (req, res) => {
    try {
        const classList = await scheduledClass.find();
        const staffIds = classList.map(cls => cls.assignedStaff);
        const staffList = await User.find({ _id: { $in: staffIds } }, { _id: 1, name: 1 });
        const staffMap = {};
        staffList.forEach(staff => {
            staffMap[staff._id.toString()] = staff.name;
        });
        const updatedClassList = classList.map(cls => ({
            ...cls._doc,
            assignedStaffName: staffMap[cls.assignedStaff.toString()] || "Unknown",
        }));
        res.status(200).json({ classes: updatedClassList });
    } catch (error) {
        console.error("Error fetching scheduled classes:", error.message);
        res.status(400).json({ error: error.message });
    }
};


const scheduleClass = async (req, res) => {
    try {
        const { degree, paperName, assignedStaff, date, time } = req.body;
        // console.log('scheduleClass/req.body-- ', req.body);
        // Validate required fields
        if (!degree || !paperName || !assignedStaff || !date || !time) {
            return res.status(400).json({ message: "All fields are required." });
        }
        // Check if a class already exists at the same time for the staff
        const existingClass = await scheduledClass.findOne({
            assignedStaff,
            date,
            time,
        });
        if (existingClass) {
            return res.status(400).json({
                message: "A class is already scheduled for this staff at this time.",
            });
        }
        // Save scheduled class
        const newClass = new scheduledClass({
            degree,
            paperName,
            assignedStaff,
            date,
            time,
        });
        await newClass.save();
        return res.status(200).json({ message: "Class scheduled successfully." });
    } catch (error) {
        console.error("Error scheduling class:", error.message);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createPaper, createStaff, getAllPapers, getAllStaffs, scheduleClass, getAllScheduledClasses };

