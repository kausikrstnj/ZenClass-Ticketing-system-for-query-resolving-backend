const Query = require("../models/queryModel");
const User = require("../models/userModel");
const Message = require('../models/messageModel');
const multer = require('multer');
const fs = require('fs');
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

const create = async (req, res) => {
    try {
        const { category, subcategory, language, title, desc, timeFrom, timeTo, attachment, userId, status, assignedTo } = req.body;
        // Generate query number
        let queryNumber = Math.floor(1000 + Math.random() * 9000);
        let query = await Query.findOne({ queryNumber: queryNumber });
        let user = await User.findOne({ _id: userId });
        let userName = user.name;
        let userEmail = user.email;
        let phn = user.phn;
        if (query) {
            queryNumber = Math.floor(1000 + Math.random() * 9000);
        }

        // Create a new query
        const resQuery = new Query({
            category,
            subcategory,
            language,
            title,
            desc,
            timeFrom,
            timeTo,
            attachment: attachment, // Save base64 encoded attachment
            status,
            assignedTo,
            userId,
            queryNumber,
            userPhn: phn,
            userName: userName
        });

        // Save the query document to the database
        await resQuery.save();
        res.status(201).json({ msg: "Query created successfully.", resQuery, userName, userEmail });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
};

const list = async (req, res) => {
    try {
        console.log(' req.params - ', req.params);
        let userId = req.params.userId;
        let role = req.params.role;
        let totalQuery = 0;
        let pendingQuery = 0;
        let assignedQueries = 0;
        let resolvedQueries = 0;
        let queries = '';

        if (role == 'mentor') { //Mentor
            queries = await Query.find({ assignedTo: userId });
            pendingQuery = await Query.countDocuments({ assignedTo: userId, status: 'pending' });
            assignedQueries = await Query.countDocuments({ assignedTo: userId, status: 'assigned' });
            resolvedQueries = await Query.countDocuments({ assignedTo: userId, status: 'closed' });
        } else if (role == 'student') { //Student
            queries = await Query.find({ userId: userId });
            pendingQuery = await Query.countDocuments({ userId: userId, status: 'pending' });
            assignedQueries = await Query.countDocuments({ userId: userId, status: 'assigned' });
            resolvedQueries = await Query.countDocuments({ userId: userId, status: 'closed' });
        } else { //Admin
            queries = await Query.find();
            pendingQuery = await Query.countDocuments({ status: 'pending' });
            assignedQueries = await Query.countDocuments({ status: 'assigned' });
            resolvedQueries = await Query.countDocuments({ status: 'closed' });
        }
        totalQuery = queries.length;
        let recentQuery = await Query.findOne({ userId: userId }).sort({ created: -1 });
        res.status(200).json({ queries, recentQuery, totalQuery, pendingQuery, assignedQueries, resolvedQueries });
    } catch (error) {
        return res.status(400).json({ error: error });
    }
};

const view = async (req, res) => {
    try {
        let queryId = req.params.queryId;
        let query = await Query.findOne({ _id: queryId });
        res.status(200).json({ query });
    } catch (error) {
        return res.status(400).json({ error: error });
    }
};

const createMessage = async (req, res) => {
    try {
        const { sender, recipient, queryId, content } = req.body;
        const message = new Message({ sender, recipient, queryId, content });
        await message.save();
        res.status(201).json({ message });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

const getMentors = async (req, res) => {
    try {
        let Mentors = await User.find({ role: 'mentor' });
        res.status(200).json({ Mentors });
    } catch (error) {
        console.error('Error getting  mentors:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

const assignMentor = async (req, res) => {
    try {
        let mentorId = req.body.mentorId;
        let queryId = req.body.queryId;
        const mentor = await User.findById(mentorId);
        const mentorName = mentor.name;
        const query = await Query.findByIdAndUpdate(queryId, { assignedTo: mentorId, status: 'assigned', mentorName: mentorName }, { new: true });
        res.status(200).json({ message: "Query assigned to mentor successfully", query });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
};

const closeQuery = async (req, res) => {
    try {
        let queryId = req.body.queryId;
        const query = await Query.findByIdAndUpdate(queryId, { status: 'closed' }, { new: true });
        res.status(200).json({ message: "Query closed by mentor successfully", query });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
};

const getAllAssignedQueries = async (req, res) => {
    try {
        let query = await Query.find({ status: 'assigned' });
        res.status(200).json({ query });
    } catch (error) {
        return res.status(400).json({ error: error });
    }
};

module.exports = { create, list, view, createMessage, getMentors, assignMentor, closeQuery, getAllAssignedQueries };

