const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const { addReview, selectReview, myReview } = require("../controller/review");

router.route("/add").post(auth, addReview);
router.route("/select").get(selectReview);
router.route("/my").get(auth, myReview);

module.exports = router;
