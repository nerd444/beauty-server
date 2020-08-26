const express = require("express");
const {
  createUser,
  loginUser,
  logoutUser,
  del,
  findId,
  findPasswd,
} = require("../controller/user");
const router = express.Router();
const auth = require("../middleware/auth");
router.route("/add").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").delete(auth, logoutUser);
router.route("/del").delete(auth, del);
router.route("/findId").post(findId);
router.route("/findPasswd").put(findPasswd);
module.exports = router;
