const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    dob: { type: Date, required: true },
    studentId: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    grade: { type: String, required: true },
    studentIdLast5: { type: String, required: true}
});

module.exports = mongoose.model("Student", studentSchema);