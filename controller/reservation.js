const connection = require("../db/myconnection");

// @desc        주문(동방신기)(결제할때 리스트에 추가해주는거)
// @POST        api/v1/reservation/order
// @request     menu, price, nick_name
// @respones    success , rows
exports.order = async (req, res, next) => {
  let menu = req.body.menu;
  let price = req.body.price;
  let nick_name = req.body.nick_name;

  let query = `insert into beauty_reservation (menu, price, nick_name) values ("${menu}", "${price}", "${nick_name}");`;

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

// @desc        주문완료 (내가 최종으로 주문한 리스트 보여주기 위한 api)
// @POST        api/v1/reservation/paymentorder
// @request     menu, price, nick_name
// @respones    success , rows
exports.PaymentOrder = async (req, res, next) => {
  let query = `insert into reservations(nick_name,menu,price,take_out,people_number,time) select nick_name,menu,price,take_out,people_number,time from beauty_reservation;`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, rows });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc        주문기록보기(결제할때 클라이언트가 볼 수 있게 보여주기)
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
      take_out: rows[0].take_out,
      people_number: rows[0].people_number,
      time: rows[0].time,
      cnt: rows.length,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc        추가 필수 사항(store)
// @PUT         api/v1/reservation/add
// @request     nick_name, take_out
// @respones    success , rows
exports.add_store = async (req, res, next) => {
  let nick_name = req.query.nick_name;
  let people_number = req.query.people_number;
  let time = req.query.time;

  let query = `update beauty_reservation set take_out = 0, 
  people_number = "${people_number}", time = "${time}" where nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, rows: rows });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc        추가 필수 사항(take_out)
// @PUT         api/v1/reservation/add
// @request     nick_name, take_out
// @respones    success , rows
exports.add_take_out = async (req, res, next) => {
  let nick_name = req.query.nick_name;
  let time = req.query.time;

  let query = `update beauty_reservation set take_out = 1, 
  time = "${time}" where nick_name = "${nick_name}";`;

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
  let nick_name = req.body.nick_name;
  let menu = req.body.menu;
  let price = req.body.price;

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

  let query = `select group_concat(menu separator' , ') as menu , sum(replace(replace(price, ","," "), "원", " ")) as price , time , take_out , people_number   from reservations where nick_name = "${nick_name}" group by time`;

  try {
    [rows] = await connection.query(query);

    res.status(200).json({
      success: true,
      rows,
      menu: rows[0].menu,
      price: rows[0].price,
      time: rows[0].time,
      take_out: rows[0].take_out,
      people_number: rows[0].people_number,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
