const express = require("express");

const router = express.Router();

const {
  addReview,
  selectReview,
  myReview,
  updateReview,
  deleteReview,
} = require("../controller/review");

router.route("/add").post(addReview);
router.route("/select").get(selectReview);
router.route("/my").get(myReview);
router.route("/update").put(updateReview);
router.route("/delete").delete(deleteReview);
module.exports = router;
