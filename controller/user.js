const connection = require("../db/myconnection");
const validator = require("validator");

// desc 유저 닉네임 이메일 생성날짜
// @POST api/v1/user/
// @request   nick_name ,email
// @respones  success ,nick_name: row[0].nick_name

exports.login = async (req, res, next) => {
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

exports.del = async (req, res, next) => {
  let phone_number = req.body.phone_number;
  let nick_name = req.body.nick_name;

  let query = `delete from beauty_user where phone_number = "${phone_number}" 
  and nick_name = "${nick_name}"`;

  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

// @desc 회원가입
// @route POST /api/v1/user/add
// @ reqest nick_name , passwd , name , phone
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
// @route POST /api/v1/user/login
// @ reqest email , passwd
// @ response  success , token
exports.loginUser = async (req, res, next) => {
  let nick_name = req.body.nick_name;
  let phone_number = req.body.phone_number;

  let query = `select * from beauty_user where nick_name = "${nick_name}" 
  and phone_number = "${phone_number}"`;
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, error: e });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

//@desc  회원탈퇴
//@route delete /api/v1/user/del
//@requset token
//@response  success
exports.deleteUser = async (req, res, next) => {
  let nick_name = req.body.nick_name;
  let phone_number = req.body.phone_number;
  let query = `delete from beauty_user where nick_name = "${nick_name}"
   and  phone_number = "${phone_number}"`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

//@desc  아이디찾기
//@route  GET /api/v1/user/findId
//@request  name, phone

exports.findId = async (req, res, next) => {
  let phone_number = req.query.phone_number;

  let query = `select nick_name from beauty_user where phone_number = "${phone_number}"  `;
  try {
    [row] = await connection.query(query);
    res.status(200).json({ success: true, ID: row[0].nick_name });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

//@desc 아이디 중복확인 api
//@route  GET/api/v1/user/findPasswd
//@request  nickname

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
//@route GET /api/v1/user/me
//@request  user_id

exports.myInfo = async (req, res, next) => {
  let nick_name = req.query.nick_name;
  let phone_number = req.query.phone_number;

  let query = `select * from beauty_user where nick_name = "${nick_name}"
   and  phone_number = "${phone_number}"`;

  try {
    [row] = await connection.query(query);
    res.status(200).json({
      success: true,
      nick_name: row[0].nick_name,
      phone_number: row[0].phone_number,
      email: row[0].email,
      created_at: row[0].created_at,
      info_agree: row[0].info_agree,
    });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};
