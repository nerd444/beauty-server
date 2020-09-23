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

  let query = `select menu, price, take_out, people_number, time from beauty_reservation where nick_name = "${nick_name}"`;

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

// @desc        추가 필수 사항
// @PUT         api/v1/reservation/add
// @request     nick_name, take_out
// @respones    success , rows
exports.add = async (req, res, next) => {
  let nick_name = req.query.nick_name;
  let take_out = req.query.take_out;
  let people_number = req.query.people_number;
  let time = req.query.time;

  let query = `update beauty_reservation set take_out = "${take_out}", 
  people_number = "${people_number}", time = "${time}" where nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, rows: rows });
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
      total: rows[0].total,
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

// @desc        내가 주문한 기록보기
// @GET         api/v1/reservation/myrecord
// @request     menu, price, nick_name
// @respones    success , rows
exports.my_order_record = async (req, res, next) => {
  let nick_name = req.query.nick_name;

  let query = `select * from beauty_reservation where nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    let menus = [];
    let prices = [];
    for (let i = 0; i < rows.length; i++) {
      let menu = rows[i].menu;
      let price = rows[i].price;
      menus[i] = menu;
      prices[i] = price;
    }
    res.status(200).json({
      success: true,
      menus: menus,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
