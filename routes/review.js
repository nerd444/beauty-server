const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const {
  addReview,
  selectReview,
  myReview,
  updateReview,
} = require("../controller/review");

router.route("/add").post(auth, addReview);
router.route("/select").get(selectReview);
router.route("/my").get(auth, myReview);
router.route("/update").put(auth, updateReview);

module.exports = router;
