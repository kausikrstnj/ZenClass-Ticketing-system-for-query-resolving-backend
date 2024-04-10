const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
    category: {
        type: String, required: "Category is required"
    },
    subcategory: {
        type: String, required: "Subcategory is required",
    },
    language: {
        type: String, required: "Language is required",
    },
    title: {
        type: String, required: "Title is required",
    },
    desc: {
        type: String, required: "Description is required",
    },
    timeFrom: {
        type: Date, required: "Available time from is required",
    },
    timeTo: {
        type: Date, required: "Available time to is required",
    },
    attachment: {
        type: String,
    },
    status: {
        type: String,
    },
    assignedTo: {
        type: String,
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    queryNumber: { type: Number },
    userPhn: { type: Number },
    userName: { type: String },
    mentorName: { type: String },

});

module.exports = mongoose.model("Query", querySchema);
