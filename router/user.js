const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const conf = require('../config/jwconf');
const author = require('../lib/middle/middleware')
function route(passport,redis){
    router.post('/signup',function(req, res, next){
        //注册自动登录
        passport.authenticate('local-signup',function(err,user,info) {
            if (err) { throw err };
            if(user){
                var token = jwt.sign(user,conf.secret,{expiresIn:60*60*2});
                redis.hmset(user.pid,['name',user.name,'id',user.pid],function(err,fb){
                    //err存在终止响应，服务器返回504
                    // err = new Error({name:'asdasd',number:0})
                    try{
                        if(err)throw err;
                        if(fb){
                            res.json({code:200,token:token});
                        }
                    }catch(error){
                        res.status(500).json({message:'未知错误'});
                    }
                })
            }else{
                res.json({code:200,message:'用户已存在'})
            }
        })(req, res, next);
    });

    router.post('/login',function(req,res,next){
        passport.authenticate('local-login',function(err,user,info){
            if(info){
                res.json({code:500,message:info});
            }else{
                var token = jwt.sign(user,conf.secret,{expiresIn:60*60*24});
                res.json({code:200,token:token});
            }
        })(req,res,next);
    });

    router.post('/loginout',author,(req,res,next)=>{
        if(req.user){
            redis.del(req.user.pid,(err,fb)=>{
                try{
                    if(err)throw err;
                    if(fb){
                        //前端注销成功要注销cookies
                        res.json({code:200,message:'注销成功'})
                    }
                }catch(error){
                    res.status(500).json({message:'未知错误'});
                }
            })
        }
    });
    return router
}

module.exports = route;