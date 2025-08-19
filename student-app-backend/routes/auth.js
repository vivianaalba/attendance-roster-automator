const express = require("express");
const router = express.Router();
require("dotenv").config();

// POST /login
router.post("/login", (req, res) => {
  const { password } = req.body;

  // Compare with the password stored in .env
  if (password === process.env.APP_PASSWORD) {
    // Return a simple token or flag
    res.json({ success: true, token: "authenticated" });
  } else {
    res.status(401).json({ success: false, message: "Incorrect password" });
  }
});

module.exports = router;