const express = require("express");

const router = express.Router();

const {
  login,
  change,
  del,
  beautyUser,
  loginUser,
  deleteUser,
  findId,
  checkId,
  myInfo,
} = require("../controller/user");

router.route("/add").post(login);

router.route("/change").put(change);
router.route("/del").delete(del);
router.route("/beauty_add").post(beautyUser);
router.route("/login").get(loginUser);
router.route("/delete_user").delete(deleteUser);
router.route("/find_id").get(findId);
router.route("/check_id").get(checkId);
router.route("/my_info").get(myInfo);
module.exports = router;
