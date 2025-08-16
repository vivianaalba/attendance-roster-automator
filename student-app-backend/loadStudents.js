require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");
const students = require("./students.json"); // your JSON file

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing students
    await Student.deleteMany({});

    // Insert students one by one to catch errors
    for (let student of students) {
      try {
        // Optional fixes:
        student.middleName = student.middleName || ""; // fill null middleName
        if (!student.studentIdLast5) {
          student.studentIdLast5 = student.studentId.slice(-5); // calculate last 5 digits
        }
        // Make sure dob is a Date object
        student.dob = new Date(student.dob);

        await Student.create(student);
      } catch (err) {
        console.error(`❌ Failed to insert ${student.studentId}:`, err.message);
      }
    }

    console.log("✅ Students loaded!");

    // Close connection
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error connecting to MongoDB:", err);
  });