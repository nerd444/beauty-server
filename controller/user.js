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
    res.status(500).json({ success: false, message: "정보를 입력해주세요" });
  }

  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = `insert into beauty_user(name,passwd,nick_name,phone) values("${name}","${hashedPasswd}","${nick_name}","${phone}")`;
  let user_id;
  try {
    [result] = await connection.query(query);
    user_id = result.insertId;
  } catch (e) {
    if (e.errno == 1062) {
      // 아이디 중복된것 이다.
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
      res.status(400).json({ success: false, result: isMatch });
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

//@desc  회원탈퇴
//@route delete /api/v1/user/del
//@requset token
//@response  success
exports.del = async (req, res, next) => {
  let user_id = req.user.id;
  let query = `delete from beauty_user where id = ${user_id}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, message: rows });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

//@desc  아이디찾기
//@route  GET /api/v1/user/findId
//@request  name, phone

exports.findId = async (req, res, next) => {
  let name = req.body.name;
  let phone = req.body.phone;

  let query = `select nick_name from beauty_user where name = "${name}" 
      and phone = "${phone}"  `;
  try {
    [row] = await connection.query(query);
    res.status(200).json({ success: true, ID: row[0].nick_name });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

//@desc  비밀번호 분실
//@route  PUT/api/v1/user/findPasswd
//@request  name, phone,nickname

exports.findPasswd = async (req, res, next) => {
  let name = req.body.name;
  let nick_name = req.body.nick_name;
  let phone = req.body.phone;
  let new_passwd = req.query.new_passwd;
  const resetPasswd = await bcrypt.hash(new_passwd, 8);

  let query = `update beauty_user set passwd = "${resetPasswd}" where
       name = "${name}" and phone = "${phone}" and nick_name = "${nick_name}"`;
     try {
        [row] = await connection.query(query);
       if (row.affectedRows==1){
        res.status(200).json({ success: true,row:row });}
        else{
          res.status(400).json({success:false})
        }
      } catch (e) {
        res.status(400).json({ success: false });
      }
    
  
};

//@desc 아이디 중복확인 api
//@route  GET/api/v1/user/findPasswd
//@request  nickname

exports.checkId = async (req, res, next) => {
  let nick_name = req.body.nick_name;

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
  let user_id = req.user.id;

  let query = `select * from beauty_user where id = ${user_id}`;

  try {
    [row] = await connection.query(query);
    res.status(200).json({
      success: true,
      name: row[0].name,
      nick_name: row[0].nick_name,
      phone: row[0].phone,
      created_at: row[0].created_at,
    });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};
