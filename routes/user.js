const express = require("express");

const router = express.Router();

const {
  login, check
} = require("../controller/user");

router.route("/add").post(login);
router.route("/check").get(check);

module.exports = router;