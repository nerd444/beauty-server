const express = require("express");
const router = express.Router();

const { order, order_record } = require("../controller/reservation");

router.route("/order").post(order);
router.route("/record").get(order_record);

module.exports = router;
