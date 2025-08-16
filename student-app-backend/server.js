// Load environment variables
require("dotenv").config();

// Import dependencies
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Initialize express app
const app = express();


// Middleware
app.use(express.json());               // Parse JSON body
app.use(cors());                       // Enable CORS
app.use(helmet({ contentSecurityPolicy: false })); // Security headers
app.use(morgan("dev"));                // Logging

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

app.get("/test", (req, res) => {
  res.json({ message: "Server is running and connected to MongoDB" });
}); // test route

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
