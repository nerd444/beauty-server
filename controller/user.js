const connection = require("../db/myconnection");
const validator = require("validator");

// desc 유저 닉네임 이메일 생성날짜 
// @POST api/v1/user/
// @request   nick_name ,email
// @respones  success ,nick_name: row[0].nick_name 

exports.login = async (req,res,next)=>{
   
    let email = req.body.email
    let nick_name = req.body.nick_name
    
    if (!validator.isEmail(email)) {
        res.status(500).json({ success: false });
        return;
      }

    let query = `insert into beauty_user (email, nick_name) values ("${email}","${nick_name}")`

    try {
        [row] = await connection.query(query)
        res.status(200).json({ success: true, nick_name: row[0].nick_name });
    } catch (e) {
        if (e.errno == 1062) {
            // 닉네임 중복된것 이다.
            res
              .status(400)
              .json({ success: false, errno: 1 });
            return;
          } else {
            res.status(500).json({ success: false, error: e });
            return;
          }
        }
}