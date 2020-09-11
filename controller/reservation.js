const connection = require("../db/myconnection");

// @desc        주문(동방신기)
// @POST        api/v1/reservation/order
// @request     menu, price, nick_name
// @respones    success , rows
exports.order = async (req, res, next) => {
  let menu = req.body.menu;
  let price = req.body.price;
  let nick_name = req.body.nick_name;

  let query = `insert into beauty_reservation (menu, price, nick_name) values ("${menu}", "${price}", "${nick_name}")`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
      rows: rows,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc        주문기록보기
// @GET         api/v1/reservation/record
// @request     nick_name
// @respones    success , rows
exports.order_record = async (req, res, next) => {
  let nick_name = req.query.nick_name;

  let query = `select menu, price from beauty_reservation where nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
      rows: rows,
      cnt: rows.length,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc        총가격
// @GET         api/v1/reservation
// @request     nick_name
// @respones    success , total
exports.order_total = async (req, res, next) => {
  let nick_name = req.query.nick_name;

  let query = `select sum(replace(replace(price, ",",""), "원", "")) as total from beauty_reservation where nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
      total: rows[0],
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc        주문취소하기
// @DELETE      api/v1/reservation/delete
// @request     menu, price, nick_name
// @respones    success , rows
exports.order_cancle = async (req, res, next) => {
  let nick_name = req.query.nick_name;
  let menu = req.query.menu;
  let price = req.query.price;

  let query = `delete from beauty_reservation where nick_name = "${nick_name}" and menu = "${menu}" and price = "${price}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc        주문취소(뒤로가기)
// @DELETE      api/v1/reservation/cancle
// @request     menu, price, nick_name
// @respones    success , rows
exports.cancle = async (req, res, next) => {
  let nick_name = req.query.nick_name;

  let query = `delete from beauty_reservation where nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
