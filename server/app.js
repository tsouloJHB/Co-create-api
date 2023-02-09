var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDb = require('./db')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const joinRouter = require('./routes/join');
const postRouter = require('./routes/posts');
const commentsRouter = require('./routes/commentsRouter');
const projectRouter = require('./routes/project');
const groupChatRouter = require('./routes/GroupChatRoute');
const messageRouter = require('./routes/messageRoutes');
const privateChatRouter = require('./routes/PrivateChatRouter');
const dotenv = require('dotenv');
const cors  = require('cors');
dotenv.config();
var app = express();
app.use(cors());
connectDb();




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postRouter);
app.use('/api/join',joinRouter);
app.use('/api/project',projectRouter);
app.use('/api/groupchat',groupChatRouter);
app.use('/api/privateChat',privateChatRouter);
app.use('/api/message',messageRouter);
app.use('/api/comments',commentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
