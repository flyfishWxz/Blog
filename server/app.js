var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); //http请求日志中间件
var cors = require('cors'); //跨域中间件
const expressJWT = require('express-jwt') //解密token的中间件
const { PWD_SELT, PRIVATE_KEY, EXPIRED } = require('./Utils/content')

var articleRouter = require('./routes/article');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comment')

var app = express();

// view engine setup 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json()); //解析post请求体中带有application/json格式的数据
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //解析cookie
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截校验
app.use(expressJWT({
    secret: PRIVATE_KEY
}).unless({
    path: ['/api/users/register', '/api/users/login', '/api/users/upload', '/api/article/allList',
            '/api/article/detail'
        ]
        //白名单(不校验)，除了这里写的地址，其他的url都需要校验
}))

app.use('/api/article', articleRouter);
app.use('/api/users', usersRouter);
app.use('/api/comment', commentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler 错误中间件处理
app.use(function(err, req, res, next) {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        res.status(404).send({ code: -1, msg: 'token校验失败' }) //这个需要根据自己的业务需要来自己处理
    } else {
        // set locals, only providing error in development设置开发环境
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error'); //渲染模板
    }
});

module.exports = app;