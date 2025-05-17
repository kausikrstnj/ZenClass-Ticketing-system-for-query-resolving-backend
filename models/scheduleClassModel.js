// models/scheduleClassModel.js

const mongoose = require("mongoose");

const scheduledClassSchema = new mongoose.Schema({
    degree: {
        type: String,
        trim: true,
        required: true,
    },
    paperName: {
        type: String,
        trim: true,
        required: true,
    },
    assignedStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: String, // format: 'YYYY-MM-DD'
        required: true,
    },
    time: {
        type: String, // format: 'HH:mm'
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ScheduledClass", scheduledClassSchema);
