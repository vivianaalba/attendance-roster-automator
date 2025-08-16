require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Count current students
    const count = await Student.countDocuments();
    console.log(`📊 Current number of students: ${count}`);

    // Drop the collection
    await Student.collection.drop().catch(err => {
      if (err.code === 26) { // NamespaceNotFound
        console.log("⚠️ Collection does not exist, nothing to drop.");
      } else {
        throw err;
      }
    });
    console.log("🗑️ Students collection dropped!");

    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error:", err);
  });