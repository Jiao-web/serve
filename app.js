var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var cors = require('cors');
var bodyParser = require('body-parser');
var userRouter = require('./routes/user');
var taskRouter = require('./routes/task');
var websiteRouter = require('./routes/website');
var roleRouter = require('./routes/role');
var accountRouter = require('./routes/account');
var accountRoleRouter = require('./routes/account_role');
var indexRouter = require('./routes/index');
var statisticRouter = require('./routes/statistic');
var logRouter = require('./routes/push_log');
var pushnodeRouter = require('./routes/push_node');
var app = express();

app.set('jwtTokenSecret', '%^&*iuet5437');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/statistic', statisticRouter);
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/website', websiteRouter);
app.use('/role', roleRouter);
app.use('/account', accountRouter);
app.use('/accountRole', accountRoleRouter);
app.use('/log', logRouter);
app.use('/node', pushnodeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  res.send({msg: err.message});
});

module.exports = app;
