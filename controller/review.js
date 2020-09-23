const connection = require("../db/myconnection");
const { off } = require("../db/myconnection");

// @desc 리뷰 작성
// @POST api/v1/review/add
// @request   nick_name(auth) , review , rating
// @respones  success ,nick_name: rows[0].nick_name,  review:rows[i].review
exports.addReview = async (req, res, next) => {
  let nick_name = req.body.nick_name;
  let review = req.body.review;
  let rating = req.body.rating;

  let query = `insert into beauty_review(nick_name , review , rating) values("${nick_name}" , "${review}" , ${rating})`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({
      success: true,
    });
    console.log(result);
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc 리뷰 삭제
// @DELETE api/v1/review/delete
// @request   nick_name(auth) , review , star_point
// @respones  success , rows
exports.deleteReview = async (req, res, next) => {
  let nick_name = req.query.nick_name;
  let review = req.query.review;
  let rating = req.query.rating;

  let query = `delete from beauty_review where nick_name = "${nick_name}" and review = 
  "${review}" and  rating= ${rating}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc 모든 리뷰 조회 25개씩
// @GET api/v1/review/select
// @request   offset , limit
// @respones  success , rows ,  count
exports.selectReview = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;
  let query = `select * from beauty_review order by created_at desc limit ${offset},${limit} `;

  if (!offset || !limit) {
    res.status(500).json({ success: false, message: "정보입력이 이상합니다" });
  }

  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
      rows: rows,
      cnt: rows.length,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
    console.log(e);
  }
};

// @desc 내 리뷰 조회
// @GET api/v1/review/my
// @request   token
// @respones  success , rows
exports.myReview = async (req, res, next) => {
  let nick_name = req.query.nick_name;
  let offset = req.query.offset;
  let limit = req.query.limit;
  let query = `select * from beauty_review where nick_name= "${nick_name}" order by created_at desc limit ${offset},${limit} `;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, rows, cnt: rows.length });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
// @desc  리뷰 수정
// @PUT api/v1/review/update
// @request   token
// @respones  success , rows
exports.updateReview = async (req, res, next) => {
  let nick_name = req.body.nick_name;
  let id = req.body.id;
  let review = req.body.review;
  let rating = req.body.rating;

  query = `update beauty_review  set  review = "${review}" , rating = ${rating} where nick_name = "${nick_name}" and id= ${id} `;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
