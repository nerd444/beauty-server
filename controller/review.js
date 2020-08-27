const connection = require("../db/myconnection");
const { off } = require("../db/myconnection");

// @desc 리뷰 작성
// @POST api/v1/review/add
// @request   nick_name(auth) , review , star_point
// @respones  success ,nick_name: rows[0].nick_name,  review,star_point
exports.addReview = async (req, res, next) => {
  let nick_name = req.user.nick_name;
  let review = req.body.review;
  let star_point = req.body.star_point;

  if (!nick_name || !review) {
    res.status(500).json({ success: false, message: "정보를 입력해주세요" });
  }

  if (star_point > 9) {
    res.status(500).json({ success: false, message: "별점이 이상합니다" });
  }

  let query = `insert into beauty_review(nick_name , review , star_point) values("${nick_name}" , "${review}" , ${star_point})`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({
      success: true,
      nick_name: rows[0].nick_name,
      review,
      star_point,
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
  let nick_name = req.user.nick_name;
  let review = req.body.review;
  let star_point = req.body.star_point;

  let query = `delete from beauty_review where nick_name = "${nick_name}" and review = "${review}" and  star_point= ${star_point}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, message: result });
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
  let query = `select * from beauty_review limit ${offset},${limit}`;

  if (!offset || !limit) {
    res.status(500).json({ success: false, message: "정보입력이 이상합니다" });
  }

  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
      message: rows,
      count: rows.length,
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
  let nick_name = req.user.nick_name;
  let query = `select * from beauty_review where nick_name= "${nick_name}"`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, message: rows });
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
  let star_point = req.body.star_point;

  query = `update beauty_review  set  review = "${review}" , star_point = ${star_point} where nick_name = "${nick_name}" and id= ${id} `;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, message: rows, review, star_point });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
