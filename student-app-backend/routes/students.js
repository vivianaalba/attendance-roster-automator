const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Student = require("../models/Student");
const { Parser } = require("json2csv");

// --------------------
// Add a new student
// --------------------
router.post("/", auth, async (req, res) => {
  const { studentId, firstName, middleName, lastName, dob, grade } = req.body;

  try {
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent)
      return res.status(400).json({ message: "Student ID already exists" });

    const student = new Student({
      studentId,
      firstName,
      middleName,
      lastName,
      dob,
      grade,
    });

    await student.save();
    res.status(201).json({ message: "Student added", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------
// Get a student by ID
// --------------------
router.get("/:studentId", auth, async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findOne({ studentId });
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search by last 5 digits of studentId
router.get("/search/:last5", auth, async (req, res) => {
  const { last5 } = req.params;
  try {
    const student = await Student.findOne({ studentIdLast5: last5 });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------
// Get all students
// --------------------
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------
// Export students as CSV
// --------------------
router.get("/export/csv", auth, async (req, res) => {
  try {
    const students = await Student.find().lean();

    // Format DOB and middleName
    const formattedStudents = students.map(s => ({
      studentId: s.studentId,
      firstName: s.firstName,
      middleName: s.middleName || "",
      lastName: s.lastName,
      dob: s.dob.toISOString().split("T")[0], // YYYY-MM-DD
      grade: s.grade
    }));

    const fields = ["studentId", "firstName", "middleName", "lastName", "dob", "grade"];
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedStudents);

    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;