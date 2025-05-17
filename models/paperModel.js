const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
    paperName: { type: String, trim: true },
    assignedStaff: { type: String, trim: true },
    created: { type: Date },
    scheduleDate: { type: Date },
    Degree: { type: String, trim: true },
});

module.exports = mongoose.model("Paper", paperSchema);
