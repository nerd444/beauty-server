const connection = require("../db/myconnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc 회원가입
// @route POST /api/v1/user/add
// @ reqest email , passwd , name , phone
// @ response  success
exports.createUser = async (req, res, next) => {
  let nick_name = req.body.nick_name;
  let passwd = req.body.passwd;
  let name = req.body.name;
  let phone = req.body.phone;

  if (!nick_name || !passwd || !name || !phone) {
    res.status(500).json("정보를 입력하세요");
  }

  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = `insert into beauty_user(name,email,passwd,phone) values("${name}","${nick_name}","${hashedPasswd}","${phone}")`;
  let user_id;
  try {
    [result] = await connection.query(query);
    user_id = result.insertId;
    res.status(200).json({ success: true, msg: "회원가입 완료" });
  } catch (e) {
    if (e.errno == 1062) {
      // 이메일 중복된것 이다.
      res.status(500).json({ success: false, message: "중복" });
    } else {
      res.status(400).json({ success: false, error: e });
    }
  }

  let token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = `insert into beauty_token(token,user_id) values("${token}",${user_id})`;

  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, msg: "토큰생성완료", token: token });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

// @desc 로그인
// @route POST /api/v1/user/login
// @ reqest email , passwd
// @ response  success , token
exports.loginUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  let query = `select * from beauty_user where nick_name = "${nick_name}"`;
  try {
    [rows] = await connection.query(query);
    let savedPasswd = rows[0].passwd;
    // 비밀번호 체크 : 비밀번호가 서로 맞는지 확인
    let isMatch = await bcrypt.compare(passwd, savedPasswd);

    if (isMatch == false) {
      res.status(200).json({ success: false, result: isMatch });
      return;
    }
    let user_id = rows[0].id;
    let token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
    query = `insert into beauty_token(token,user_id) values("${token}",${user_id})`;
    try {
      [result] = await connection.query(query);
      res.status(200).json({ success: true, token: token });
    } catch (e) {
      res.status(400).json({ success: false, error: e });
    }
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
// @desc 로그아웃
// @route delete /api/v1/user/logout
// @ reqest token
// @ response  success
exports.logoutUser = async (req, res, next) => {
  let user_id = req.user.id;
  let query = `delete from beauty_token where user_id = ${user_id}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, message: "로그아웃 완료" });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
