const express = require("express");

const router = express.Router();

const {
  login, check, change, del
} = require("../controller/user");

router.route("/add").post(login);
router.route("/check").get(check);
router.route("/change").put(change)
router.route("/del").delete(del)
module.exports = router;