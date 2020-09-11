const express = require("express");
const router = express.Router();

const {
  order,
  order_record,
  order_cancle,
  cancle,
  order_total,
} = require("../controller/reservation");

router.route("/order").post(order);
router.route("/record").get(order_record);
router.route("/delete").delete(order_cancle);
router.route("/cancle").delete(cancle);
router.route("/total").get(order_total);

module.exports = router;
