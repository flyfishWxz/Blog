var express = require('express');
var router = express.Router();
const query=require('../db/index')

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//发表评论接口
router.post('/public',async(req,res,next)=>{
  try{
    let {content,art_id}=req.body
    let {username}=req.user//出现undefined异常，是因为在app.js中将add加如了白名单所有内部token
    let result=await query('select id,head_img,nickname from user where username =?',[username])
    let {id:userId,head_img,nickname}=result[0]
    await query('insert into comment (user_id,head_img,content,article_id,nickname,comm_time) values(?,?,?,?,?,NOW())'
    ,[userId,head_img,content,art_id,nickname])
    res.send({code:0,msg:'评论成功'})
  }catch(err){
    console.log(err)
    next()
  }
})
//显示所有评论
router.get('/commList',async(req,res,next)=>{
  try{
    let {art_id}=req.query
    let result=await query('select nickname,head_img,content,DATE_FORMAT(comm_time,"%Y-%m-%d %H:%i:%s") AS comm_time from comment where article_id=?',[art_id])
    console.log(result)
    res.send({code:0,msg:'显示成功',data:result})
  }catch(err){
    console.log(err)
    next()
  }
})
module.exports = router;
