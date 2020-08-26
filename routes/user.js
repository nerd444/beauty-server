const express = require("express");
const { createUser, loginUser, logoutUser } = require("../controller/user");
const router = express.Router();

router.route("/add").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").delete(logoutUser);

module.exports = router;
