const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwfConf = require('../config/jwconf');
function route(passport){
    router.all('/',function(req, res, next){
        console.log('sd')
        let token = req.headers.authorized;
        jwt.verify(token,conf.secret,function(err, decoded) {
            if (err) {
                res.json({code:500,message:err.message});
            }else{
                next();
            }
        });
    });
    router.get('/list',function(req,res,next){
        console.log(next);
    })
    return router;
}

module.exports = route;