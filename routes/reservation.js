const express = require("express");
const router = express.Router();

const {
  order,
  order_record,
  order_cancle,
  cancle,
  order_total,
  my_order_record,
  add_take_out,
  add_store,
  PaymentOrder,
  del_store,
} = require("../controller/reservation");

router.route("/order").post(order);
router.route("/record").get(order_record);
router.route("/myrecord").get(my_order_record);
router.route("/add_store").put(add_store);
router.route("/del_store").put(del_store);
router.route("/add_take_out").put(add_take_out);
router.route("/delete").delete(order_cancle);
router.route("/cancle").delete(cancle);
router.route("/").get(order_total);
router.route("/paymentorder").post(PaymentOrder);

module.exports = router;
