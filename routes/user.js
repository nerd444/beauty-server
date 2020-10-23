const express = require("express");

const router = express.Router();

const {
  CreatedatUser,
  check,
  change,
  beautyUser,
  loginUser,
  deleteUser,
  findId,
  checkId,
  myInfo,
} = require("../controller/user");

router.route("/add").post(CreatedatUser);
router.route("/check").get(check);
router.route("/change").put(change);
router.route("/beauty_add").post(beautyUser);
router.route("/login").get(loginUser);
router.route("/del").delete(deleteUser);
router.route("/find_id").get(findId);
router.route("/check_id").get(checkId);
router.route("/my_info").get(myInfo);

module.exports = router;
