const express = require("express");

const router = express.Router();

const {
  login
} = require("../controller/user");

router.route("/add").post(login);


module.exports = router;