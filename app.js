
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';

import indexRouter from './routes/index.js';

import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import helmet from 'helmet';
import { fileURLToPath } from 'url';

import db from './modules/store.js';

import store from './config/globalStorage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var sassMiddleware = require('node-sass-middleware');

// var indexRouter = require('./routes/index');

var app = express();

// const passport = require('passport');
// const session = require('express-session');
// const flash = require('connect-flash');
// const helmet = require("helmet");


// const signalR = require("@microsoft/signalr");

// let connection = new signalR.HubConnectionBuilder()
//     .withUrl("/oauth/login")
//     .build();
// connection.on("send", data => {
//     console.log(data);
// });
// connection.start()
//     .then(() => connection.invoke("send", "Hello"));

app.use(helmet());
app.set('$store', store);

app.use(session(
    {
    //store: store,
    resave: true,
    saveUninitialized: true,
    secret: 'Test-Secret-2022'
  }
));

// Passport Session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/dist')); // redirect Socket.IO

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// db
// db.init();

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;

export default app;