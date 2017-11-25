const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const conf = require('../../config/database');
const pool  = mysql.createPool(conf);
const jwt = require('jsonwebtoken');
const jwfConf = require('../../config/jwconf');
// const  client  = require('../redis/');
// const redis = require('redis');
function userStrategy(passport){
    //当authenticate的session为true并且没有回调函数，会调用serializeUser；
    //当session为false时，调用done，第二个参数true时，则可以作为中间件使用
    // passport.serializeUser(function(user, done) {
    //     console.log(user.id)
    //     done(null, user.id);
    // });

    // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //     console.log(1)
    // });
    passport.use('local-signup',new LocalStrategy({
        usernameField: 'account',
        passwordField: 'pass'
    },function(username, password, done) {
        pool.query("SELECT * FROM users WHERE name = ?",[username],function (error, results, fields) {
            if (error) throw error;
            if(!results.length){
                var insertQuery = "INSERT INTO users (name,password) values (?,?)";
                pool.query(insertQuery,[username,password],function(err, rows,fields){
                    if(err){
                        done(err);
                    };
                    //1.添加
                    return done(null,{name:username,pid:rows.insertId});
                });
            }else{
                //2.存在
                    return done(null,null)
                // done(null,{name:results[0].name,pid:results[0].pid});
            }
        });
    }));
    passport.use('local-login',new LocalStrategy({
        usernameField: 'account',
        passwordField: 'pass'
    },function(username, password, done) {
        pool.query("SELECT * FROM users WHERE name = ?",[username],function (error, results, fields) {
            if (error) throw error;
            if(results.length){
                if(results[0].password == password){
                    return done(null,{name:results[0].name,password:results[0].password,pid:results[0].pid});
                }else{
                    return done(null,null,'密码不正确');
                }
            }else{
                done(null,null,'未注册');
            }
        });
    }));
}
module.exports = userStrategy;