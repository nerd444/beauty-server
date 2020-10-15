const connection = require("../db/myconnection");
const validator = require("validator");

// desc 유저 닉네임 이메일 생성날짜
// @POST api/v1/user/add
// @request   nick_name ,email
// @respones  success ,nick_name: row[0].nick_name

exports.CreatedatUser = async (req, res, next) => {
  let email = req.body.email;
  let nick_name = req.body.nick_name;
  let phone_number = req.body.phone_number;
  let info_agree = req.body.info_agree;
  let query = `insert into beauty_user ( nick_name,phone_number,email, info_agree)
   values ("${nick_name}","${phone_number}","${email}",${info_agree})`;

  try {
    [row] = await connection.query(query);
    res.status(200).json({ success: true, row: row });
  } catch (e) {
    if (e.errno == 1062) {
      // 닉네임 중복된것 이다.
      res.status(400).json({ success: false, errno: 1 });
      return;
    } else {
      res.status(500).json({ success: false });
    }
  }
};

// desc 카카오톡 계정 있는지 확인
// @POST api/v1/user/check
// @request   nick_name ,email
// @respones  success ,nick_name: row[0].nick_name
exports.check = async (req, res, next) => {
  let email = req.query.email;

  let query = `select * from beauty_user where email = "${email}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
      email: rows[0].email,
      nick_name: rows[0].nick_name,
      created_at: rows[0].created_at,
    });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

// desc 유저 비밀번호 변경
// @POST api/v1/user/change
// @request   nick_name , phone_number , new_nick_name
// @respones  success ,nick_name: row[0].nick_name
exports.change = async (req, res, next) => {
  let phone_number = req.query.phone_number;
  let new_nick_name = req.query.new_nick_name;
  let nick_name = req.query.nick_name;
  let query = `update beauty_user set nick_name = "${new_nick_name}" where
   nick_name = "${nick_name}" and phone_number = "${phone_number}"`;

  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    if (e.errno == 1062) {
      // 닉네임 중복된것 이다.
      res.status(400).json({ success: false, errno: 1 });
      return;
    } else {
      res.status(500).json({ success: false });
    }
  }
};

// @desc 회원가입
// @route POST /api/v1/user/add
// @ reqest nick_name , phone_number , info_agree
// @ response  success
exports.beautyUser = async (req, res, next) => {
  let nick_name = req.body.nick_name;
  let phone_number = req.body.phone_number;
  let info_agree = req.body.info_agree;

  if (!nick_name || !phone_number) {
    res.status(500).json({ success: false, message: "정보를 입력해주세요" });
  }

  let query = `insert into beauty_user(nick_name,phone_number,info_agree)
   values("${nick_name}","${phone_number}",${info_agree})`;
  try {
    [row] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    if (e.errno == 1062) {
      // 닉네임 중복된것 이다.
      res.status(400).json({ success: false });
      return;
    } else {
      res.status(500).json({ success: false });
    }
  }
};

// @desc 로그인
// @route GET /api/v1/user/login
// @ reqest nick_name , phone_number
// @ response  success , token
exports.loginUser = async (req, res, next) => {
  let nick_name = req.query.nick_name;
  let phone_number = req.query.phone_number;

  let query = `select * from beauty_user where nick_name = "${nick_name}" 
  and phone_number = "${phone_number}"`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
      nick_name: rows[0].nick_name,
      phone_number: rows[0].phone_number,
      email: rows[0].email,
      created_at: rows[0].created_at,
      info_agree: rows[0].info_agree,
    });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// desc 회원탈퇴
// @POST api/v1/user/del
// @request   nick_name
// @respones  success ,nick_name: row[0].nick_name
exports.deleteUser = async (req, res, next) => {
  let nick_name = req.query.nick_name;

  let query = `delete from beauty_user where nick_name = "${nick_name}"`;

  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

//@desc  아이디찾기
//@route  GET /api/v1/user/find_Id
//@request  phone_number
//@response  success
exports.findId = async (req, res, next) => {
  let phone_number = req.query.phone_number;

  let query = `select nick_name from beauty_user where phone_number = "${phone_number}"  `;
  try {
    [row] = await connection.query(query);
    res.status(200).json({ success: true, nick_name: row[0].nick_name });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

//@desc 아이디 중복확인 api
//@route  GET/api/v1/user/check_id
//@request  nick_name
//@response  success
exports.checkId = async (req, res, next) => {
  let nick_name = req.query.nick_name;

  let query = `select * from beauty_user where nick_name = "${nick_name}"`;
  try {
    [row] = await connection.query(query);
    if (row.length == 0) {
      res.status(200).json({ success: true });
      return;
    } else {
      res.status(400).json({ success: false });
    }
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

//@desc 내정보 불러오기
//@route GET /api/v1/user/my_info
//@request  nick_name
//@response  success
exports.myInfo = async (req, res, next) => {
  let nick_name = req.query.nick_name;

  let query = `select * from beauty_user where nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({
      success: true,
      nick_name: rows[0].nick_name,
      phone_number: rows[0].phone_number,
      email: rows[0].email,
      created_at: rows[0].created_at,
      info_agree: rows[0].info_agree,
    });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};
