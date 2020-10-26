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
// @request     menu, price, nick_name
// @respones    success , rows
exports.order_record = async (req, res, next) => {
  let nick_name = req.query.nick_name;

  let menu;
  let price;

  let query = `select menu , price from beauty_reservation where nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    for (let i = 0; i < rows.length; i++) {
      menu = rows[i].menu;
      price = rows[i].price;
    }
    res.status(200).json({
      success: true,
      menu,
      price,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
