const { ExtractJwt, Strategy } = require('passport-jwt');
//const { User }      = require('../models');
const CONFIG        = require('../auth/config');
const {to,ReE}          = require('../services/utilService.js');
var UserService = require('../services/userService.js')
 
module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;
    opts.passReqToCallback= true;
    //console.log('random string is ;;;',Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    passport.use(new Strategy(opts, async function(req,jwt_payload, done){
        let err, user;
        if(req.device.type==='phone'){
            [err, user] = await to(new UserService().findWebUser(jwt_payload.user_id));
        } else {
            [err, user] = await to(new UserService().findWebUser(jwt_payload.user_id));
        }
        
        var token = req.header('Authorization');
        var loginKeys=await new UserService().getLoginSuccessKey(token);
        if(loginKeys.length===0){
            return ReE(req.res, {message:'User session is inactive'},400);
            //return done(new Error(), false);
        }

        if(err) return done(err, false);
        if(user) {
            return done(null, user[0]);
        }else{
            return done(null, false);
        }
    }));
}