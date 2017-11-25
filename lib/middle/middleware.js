const jwt = require('jsonwebtoken');
const conf = require('../../config/jwconf');
function authorize(req,res,next){
    let token = req.headers.authorized;
    jwt.verify(token,conf.secret,function(err, decoded) {
            if (err) {
                res.json({code:500,message:err.message});
            }else{
               req.user = decoded;
                next();
            }
    });
}
module.exports = authorize