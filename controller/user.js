const connection = require("../db/myconnection");
const validator = require("validator");

// desc 유저 닉네임 이메일 생성날짜 
// @POST api/v1/user/
// @request   nick_name ,email
// @respones  success ,nick_name: row[0].nick_name 

exports.login = async (req,res,next)=>{
   
    let email = req.body.email
    let nick_name = req.body.nick_name
    


    let query = `insert into beauty_user (email, nick_name) values ("${email}","${nick_name}")`

    try {
        [row] = await connection.query(query)
        res.status(200).json({ success: true , row:row});
        
    } catch (e) {
       
        if (e.errno == 1062) {
            // 닉네임 중복된것 이다.
            res
              .status(400)
              .json({ success: false, errno: 1 });
            return;
          } else {
            res.status(500).json({ success: false});
           
          }
        }
}

exports.check = async (req,res,next)=>{
    let email = req.query.email

    let query = `select * from beauty_user where email = "${email}"`

    try {
        [rows] = await connection.query(query)
        res.status(200).json({success:true, email:rows[0].email, nick_name:rows[0].nick_name,created_at:rows[0].created_at})
    } catch (e) {
        res.status(500).json({success:false})
    }
}

exports.change = async(req,res,next)=>{
    let email = req.query.email
    let new_nick_name = req.query.new_nick_name

    let query = `update beauty_user set nick_name = "${new_nick_name}" where email = "${email}"`

    try {
        [result] = await connection.query(query)
        res.status(200).json({ success: true});
    } catch (e) {
        if (e.errno == 1062) {
            // 닉네임 중복된것 이다.
            res
              .status(400)
              .json({ success: false, errno: 1 });
            return;
          } else {
            res.status(500).json({ success: false});
           
          }
    }
}

exports.del = async(req,res,next)=>{
    let email = req.query.email

    let query = `delete from beauty_user where email = "${email}"`

    try {
        [result] = await connection.query(query)
        res.status(200).json({success:true})
    } catch (e) {
        res.status(500).json({success:false})
    }
}
