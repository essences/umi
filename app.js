var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var login = require('./routes/login');
var logout = require('./routes/logout');
var addlogin = require('./routes/addlogin');
var changepassword = require('./routes/changepassword');
var menu = require('./routes/menu');
var setauth = require('./routes/setauth');
var list = require('./routes/list');
var detail = require('./routes/detail');
var addemployee = require('./routes/addemployee');
var comment = require('./routes/comment');
var mstqualify = require('./routes/mstqualify');

// 環境設定ファイル
var env = require('../umi_env.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 環境設定ファイルに本番だけ設定を行っているため、それを設定する
if (env.emvironment != null && env.emvironment.length > 0) {
	app.set('env', env.emvironment);
}

app.use('/', login);
app.use('/login', login);
app.use('/logout', logout);
app.use('/addlogin', addlogin);
app.use('/changepassword', changepassword);
app.use('/menu', menu);
app.use('/setauth', setauth);
app.use('/list', list);
app.use('/detail', detail);
app.use('/addemployee', addemployee);
app.use('/comment', comment);
app.use('/mstqualify', mstqualify);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 例外ハンドラ
process.on('uncaughtException', function(err) {
  console.log(err);
});

module.exports = app;
