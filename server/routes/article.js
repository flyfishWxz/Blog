var express = require('express');
var router = express.Router();
const query = require('../db/index')

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//新增文章接口
router.post('/add', async(req, res, next) => {
        try {
            let { title, content } = req.body
                //console.log(req.user)
            let { username } = req.user //出现undefined异常，是因为在app.js中将add加如了白名单所有内部token
            let result = await query('select id from user where username =?', [username])
            let userId = result[0].id
                //console.log(userId) 
            await query('insert into article (title,content,user_id,create_time) values(?,?,?,NOW())', [title, content, userId])
            res.send({ code: 0, msg: '新增成功' })
        } catch (err) {
            console.log(err)
            next()
        }
    })
    //更新或编辑文章接口
router.post('/update', async(req, res, next) => {
        try {
            let { title, content, id } = req.body
            let { username } = req.user //出现undefined异常，是因为在app.js中将add加如了白名单所有内部token
            let result = await query('select id from user where username =?', [username])
            let userId = result[0].id
            await query('update article set title=?,content=?,create_time=NOW() where id=? and user_id=?', [title, content, id, userId])
            res.send({ code: 0, msg: '更新成功' })
        } catch (err) {
            console.log(err)
            next()
        }
    })
    //删除博客接口
router.post('/delete', async(req, res, next) => {
        try {
            let { id } = req.body
            let { username } = req.user //出现undefined异常，是因为在app.js中将add加如了白名单所有内部token
            let result = await query('select id from user where username =?', [username])
            let userId = result[0].id
            await query('delete from article where id=? and user_id=?', [id, userId])
            res.send({ code: 0, msg: '删除成功' })
        } catch (err) {
            console.log(err)
            next()
        }
    })
    //获取全部博客列表接口
router.get('/allList', async(req, res, next) => {
        try {
            let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article';
            let result = await query(sql)
            res.send({ code: 0, msg: '新增成功', data: result })
        } catch (err) {
            console.log(err)
            next()
        }
    })
    //获取登录用户的博客列表
router.get('/userBlog', async(req, res, next) => {
        let { username } = req.user
        try {
            let sql = 'select id from user where username=?';
            let userId = await query(sql, [username])
            let result = await query('select id,title,DATE_FORMAT(create_time,"%Y-%m-%d") AS create_time from article where user_id=?', [userId[0].id])
                //console.log(result)
            res.send({ code: 0, data: result })
        } catch (err) {
            console.log(err)
            next()
        }
    })
    //获取博客详情
router.get('/detail', async(req, res, next) => {
    try {
        let art_id = req.query.art_id
        let result = await query('select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d") AS create_time from article where id=?', [art_id])
        res.send({ code: 0, msg: '获取成功', data: result[0] })
    } catch (err) {
        console.log(err)
        next()
    }
})
module.exports = router;