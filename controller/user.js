const connection = require("../db/myconnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc 회원가입
// @route POST /api/v1/user/add
// @ reqest nick_name , passwd , name , phone
// @ response  success
exports.createUser = async (req, res, next) => {
  let nick_name = req.body.nick_name;
  let passwd = req.body.passwd;
  let name = req.body.name;
  let phone = req.body.phone;

  if (!nick_name || !passwd || !name || !phone) {
    res.status(500).json({ success: false, error: "정보를 입력해주세요" });
  }

  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = `insert into beauty_user(name,passwd,nick_name,phone) values("${name}","${hashedPasswd}","${nick_name}","${phone}")`;
  let user_id;
  try {
    [result] = await connection.query(query);
    user_id = result.insertId;
  } catch (e) {
    if (e.errno == 1062) {
      // 이메일 중복된것 이다.
      res
        .status(500)
        .json({ success: false, message: "이미 있는 닉네임입니다." });
    } else {
      res.status(400).json({ success: false, error: e });
    }
  }

  let token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = `insert into beauty_token(token,user_id) values("${token}",${user_id})`;

  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, msg: "회원가입 완료", token: token });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc 로그인
// @route POST /api/v1/user/login
// @ reqest email , passwd
// @ response  success , token
exports.loginUser = async (req, res, next) => {
  let nick_name = req.body.nick_name;
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
    res.status(500).json({ success: false, error: e });
  }
};

//@desc  회원탈퇴
//@route delete /api/v1/user/del
//@requset token
//@response  success
exports.del = async (req, res, next) => {
  let user_id = req.user.id;
  let query = `delete from beauty_user where user_id = ${user_id}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

//@desc  아이디찾기
//@route  GET//api/v1/user/findId
//@request  name, phone

exports.findId = async (req, res, next) => {
  let name = req.body.name;
  let passwd = req.body.passwd;
  let phone = req.body.phone;

  let query = `select * from beauty_user where name = "${name}" and phone = "${phone}"`;

  try {
    [rows] = await connection.query(query);
    let savedPasswd = rows[0].passwd;
    let savedName = rows[0].name;
    let savedPhone = rows[0].phone;

    let isMatch = await bcrypt.compare(passwd, savedPasswd);

    if (isMatch == false) {
      res.status(400).json({
        success: false,
        message: "비밀번호가 맞지 않습니다.",
      });
      return;
    } else if (savedName != name) {
      res.status(400).json({
        success: false,
        message: "이름이 맞지 않습니다.",
      });
      return;
    } else if (savedPhone != phone) {
      res.status(400).json({
        success: false,
        message: "전화번호가 맞지 않습니다.",
      });
      return;
    } else {
      query = `select nick_name from beauty_user where name = "${name}" 
      and phone = "${phone}" and passwd = "${savedPasswd}" `;
      try {
        [row] = await connection.query(query);
        res.status(200).json({ success: true, ID: row });
      } catch (e) {
        res.status(400).json({ success: false });
      }
    }
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

//@desc  비밀번호 분실
//@route  PUT/api/v1/user/findPasswd
//@request  name, phone,nickname

exports.findPasswd = async (req, res, next) => {
  let name = req.body.name;
  let nick_name = req.body.nick_name;
  let phone = req.body.phone;
  let new_passwd = req.body.new_passwd;
  const hashedPasswd = await bcrypt.hash(new_passwd, 8);
  let query = `select * from beauty_user where name = 
  "${name}" and phone = "${phone}" and nick_name = "${nick_name}"`;

  try {
    [rows] = await connection.query(query);
    let savedNick_name = rows[0].nick_name;
    let savedName = rows[0].name;
    let savedPhone = rows[0].phone;

    if (savedNick_name != nick_name) {
      res.status(400).json({
        success: false,
        message: "아이디가 맞지 않습니다.",
      });
      return;
    } else if (savedName != name) {
      res.status(400).json({
        success: false,
        message: "이름이 맞지 않습니다.",
      });
      return;
    } else if (savedPhone != phone) {
      res.status(400).json({
        success: false,
        message: "전화번호가 맞지 않습니다.",
      });
      return;
    } else {
      query = `update beauty_user set passwd = "${hashedPasswd}" where
       name = "${name}" and phone = "${phone}" and nick_name = "${nick_name}"`;
      try {
        [row] = await connection.query(query);
        res.status(200).json({ success: true });
      } catch (e) {
        res.status(400).json({ success: false });
      }
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
