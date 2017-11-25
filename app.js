const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
// const session = require('express-session');
const moment = require('moment');
// const winston = require('winston');
const bodyParser = require('body-parser');
const app = express();
const user = require('./router/user');
const goods = require('./router/goods');
const expressWinston = require('express-winston');
const userStrategy = require('./lib/passport');
const passport = require('passport');
const  client  = require('./lib/redis');
const redis = require('redis');

userStrategy(passport);
app.use(logger('combined'));
// app.use(expressWinston.logger({
//     transports: [
//         new (winston.transports.Console)({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.File({
//             filename: 'logs/success.log'
//         })
//     ],
//     colorize:true
// }));
app.use('/static',express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({
//     name:'token',
//     resave:true,
//     saveUninitialized:true,
//     secret: '1stisthebest',
//     cookie: { maxAge: 3600 * 1000  },
//     secure: false
// }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.File({
//             filename: 'logs/error.log'
//         })
//     ]
// }));
//
// app.use(function(req, res,next){
//     console.log('hehe');
//     next();
// })
app.use('/api/user',user(passport,client));
app.use('/api/goods',goods(passport,client));

app.listen(8092);