const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const { addReview, selectReview } = require("../controller/review");

router.route("/add").post(auth, addReview);
router.route("/select").get(selectReview);

module.exports = router;
