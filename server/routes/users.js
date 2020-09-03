var express = require('express');
var router = express.Router();
const query = require('../db/index')
const { PWD_SELT, PRIVATE_KEY, EXPIRED } = require('../Utils/content')
const { md5, upload } = require('../Utils/index') //加密函数
const jwt = require('jsonwebtoken') //登录令牌


/* 注册接口 */
router.post('/register', async(req, res, next) => {
    let { username, password, nickname, head_img } = req.body
        //判断用户名是否被注册过
    let user = await query('select * from user where username = ? ', [username])
    console.log(req.body)
    try {
        if (!user || user.length === 0) { //返回的查询结果为空则未被注册
            password = md5(`${password}${PWD_SELT}`)
            await query('insert into user (username,password,nickname,head_img) values (?,?,?,?)', [username, password, nickname, head_img])
            res.send({ code: 0, msg: '注册成功' })
        } else {
            res.send({ code: -1, msg: '该用户名已被注册' })
        }
    } catch (err) {
        console.log(err)
        next(err) //交由错误中间件处理
    }
});
// 登录接口
router.post('/login', async(req, res, next) => {
        let { username, password } = req.body
        try {
            let user = await query('select * from user where username =?', [username])
            password = md5(`${password}${PWD_SELT}`)
            let result = await query('select * from user where password =?', [password])
            if (!user || user.length === 0) { //账号不存在
                res.send({ code: -1, msg: '用户名错误或者不存在' })
            } else if (!result || result.length === 0) {
                res.send({ code: -1, msg: '密码错误' })
            } else {
                let token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: EXPIRED })
                res.send({ code: 0, msg: '登录成功', token: token })
            }
        } catch (err) {
            console.log(err)
        }
    })
    //获取用户信息接口
router.get('/info', async(req, res, next) => {
        try {
            let { username } = req.user
            let userinfo = await query('select nickname,head_img from user where username = ?', [username])
                //console.log(userinfo)
            res.send(userinfo[0])
        } catch (e) {
            console.log(e)
        }
    })
    //上传头像接口
router.post('/upload', upload.single('head_img'), async(req, res, next) => {
        try {
            //console.log(req.file)  
            let imgPath = req.file.path.split('public')[1]
            let imgUrl = 'http://127.0.0.1:3000' + imgPath
            res.send({ code: 0, msg: '上传成功', data: imgUrl }) //将图片地址发给前端，并展示在页面上
        } catch (e) {
            console.log(e)
        }
    })
    //用户信息更新
router.post('/update', async(req, res, next) => {
    let { nickname, head_img } = req.body
    let { username } = req.user //从用户的token中获取username
    try {
        console.log(req.body)
        let result = await query('update user set nickname=?,head_img=? where username=? ', [nickname, head_img, username])

        //此处异常sql语句更新两列是不能用and
        //console.log(result)
        res.send({ code: 0, data: null })
    } catch (e) {
        console.log(e)
    }
})
module.exports = router;


// query('select * from user where username = ? ',[username]).then(res=>{
//   console.log(res)
//   if(!res||res.length===0){//返回的查询结果为空则未被注册
//     password=md5(`${password}${PWD_SELT}`)
//     query('insert into user (username,password,nickname) values (?,?,?)',[username,password,nickname])
//     res.send({code:0,msg:'注册成功'})
//   }else{
//     res.send({code:-1,msg:'该用户名已被注册'})
//   }
// }).catch(err=>{
//     console.log(err)
//     next(err)//交由错误中间件处理
// })