module.exports = function (req, res, next) {
  const token = req.headers["authorization"];
  if (token === "authenticated") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};