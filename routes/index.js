var express = require("express");
var router = express.Router();
const userModel = require("./users");

router.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

router.post("/register", (req, res) => {
  const { username, email, fullName } = req.body;
  const userData = new userModel({ username, email, fullName });
});

module.exports = router;
