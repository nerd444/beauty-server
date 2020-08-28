const express = require("express");

const router = express.Router();

const {
  addReview,
  selectReview,
  myReview,
  updateReview,
} = require("../controller/review");

router.route("/add").post(addReview);
router.route("/select").get(selectReview);
router.route("/my").get(myReview);
router.route("/update").put(updateReview);

module.exports = router;
