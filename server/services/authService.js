//const { User }      = require('../models');
const validator     = require('validator');
const { to, TE }    = require('./utilService');
//const bcrypt            = require('bcrypt');
//const bcrypt_p          = require('bcrypt-promise');
const jwt               = require('jsonwebtoken');
var UserService = require('../services/userService.js')
const CONFIG = require('../auth/config');
const encryptUtil = require('../util/encryptUtil.js')

class AuthService{
    constructor(){
        this.service=new UserService();
        this.authUser=this.authUser.bind(this);
        this.createUser=this.createUser.bind(this);
        this.authWebUser=this.authWebUser.bind(this);
        this.createWebUser=this.createWebUser.bind(this);
    }

    auditLoginSuccess(auditInfo){    
        this.service.loginSuccess(auditInfo);
    }

    auditLoginFailure(auditInfo){
        this.service.loginFailure(auditInfo);
    }

    async auditWebLoginSuccess(auditInfo){    
        await this.service.webLoginSuccess(auditInfo);
    }

    auditWebLoginFailure(auditInfo){
        this.service.webLoginFailure(auditInfo);
    }

    async authUser(userInfo){//returns token
        console.log('In auth user');
        let unique_key;
        let auth_info = {};
        auth_info.status = 'login';
        unique_key = userInfo.phone;

        if(!unique_key) TE('Please Enter your Mobile No. to Login');

        if(!userInfo.password) TE('Please Enter a Password to Login');

        let user,err,pass;
        let usersArray;
        if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
            auth_info.method='phone';

            [err, usersArray] = await to(this.service.findUser(unique_key));
            if(err) {
                this.auditLoginFailure({user_id:parseInt(unique_key),message:err.message,role:null});
                TE(err.message);
            }

        }else{
            this.auditLoginFailure({user_id:parseInt(unique_key),message:'invalid phone number',role:null});
            TE('A valid phone number was not entered');
        }
        if(usersArray.length==0){
            this.auditLoginFailure({user_id:parseInt(unique_key),message:'invalid phone number',role:null});
            TE('Not a registered mobile number');
        } else {
            user=usersArray[0];
        }
        if(!user) TE('Not a registered mobile number');
        //[err, pass] = await to(bcrypt_p.compare(userInfo.password, user.password));
        /*if(err) {
            this.auditLoginFailure({user_id:parseInt(unique_key),message:err.message,role:user.user_type_code});
           // TE(err.message);
        }*/
        //if(!pass) {
        if(userInfo.password !== encryptUtil.decrypt(user.password)) {
            this.auditLoginFailure({user_id:parseInt(unique_key),message:'invalid password',role:user.user_type_code});
            TE('invalid password');
        }
        delete user['password'];

        return user;

    }

    async createUser (userInfo) {
        console.log('In create user');
        let unique_key, auth_info, err, user;

        auth_info={};
        auth_info.status='create';

        unique_key = userInfo.phone;
        if(!unique_key) TE('Phone number was not entered.');

        if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
            auth_info.method = 'phone';
            //userInfo.id = unique_key;

            /*let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if(err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(userInfo.password, salt));
            if(err) TE(err.message, true);*/

            userInfo.password = encryptUtil.encrypt(userInfo.password);

            [err, user] = await to(this.service.createUser(userInfo));
            if(err) TE('user already exists with that phone number');
            let usersArray;
            [err, usersArray] = await to(this.service.findUser(unique_key));
            user=usersArray[0];
            delete user['password'];
            return user;
        }else{
            TE('A phone number was not entered.');
        }
    }

    async createWebUser (userInfo) {
        console.log('In create user');
        let unique_key, auth_info, err, user;

        auth_info={};
        auth_info.status='create';

        unique_key = userInfo.phone;
        if(!unique_key) TE('Phone number was not entered.');

        if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
            auth_info.method = 'phone';
            //userInfo.id = unique_key;

            /*let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));
            if(err) TE(err.message, true);

            [err, hash] = await to(bcrypt.hash(userInfo.password, salt));
            if(err) TE(err.message, true);*/

            userInfo.password = encryptUtil.encrypt(userInfo.password);

            [err, user] = await to(this.service.createWebUser(userInfo));
            if(err) TE('user already exists with that phone number');
            let usersArray;
            [err, usersArray] = await to(this.service.findWebUser(unique_key));
            user=usersArray[0];
            delete user['password'];
            return user;
        }else{
            TE('A phone number was not entered.');
        }
    }

    async getJWT(phone) {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        let user_id=parseInt(phone);
        // var token = "Bearer "+ jwt.sign({user_id:user_id}, CONFIG.jwt_encryption, {expiresIn: '24h'});
        var token = "Bearer "+ jwt.sign({user_id:user_id}, CONFIG.jwt_encryption);
            return token;
    }

    async authWebUser(userInfo){//returns token
        console.log('In auth user');
        let unique_key;
        let auth_info = {};
        auth_info.status = 'login';
        unique_key = userInfo.phone;

        if(!unique_key) TE('Please phone number to login');


        if(!userInfo.password) TE('Please enter a password to login');

        let user,err,pass;
        let usersArray;
        if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
            auth_info.method='phone';

            [err, usersArray] = await to(this.service.findWebUser(unique_key));
            if(err) {
                this.auditWebLoginFailure({user_id:parseInt(unique_key),message:err.message,role:null});
                TE(err.message);
            }

        }else{
            this.auditWebLoginFailure({user_id:parseInt(unique_key),message:'invalid phone number',role:null});
            TE('A valid phone number was not entered');
        }
        if(usersArray.length==0){
            this.auditWebLoginFailure({user_id:parseInt(unique_key),message:'Not a registered mobile number',role:null});
            TE('Not a registered mobile number');
        } else {
            user=usersArray[0];
        }
        //if(!user) TE('Not registered');
        /*[err, pass] = await to(bcrypt_p.compare(userInfo.password, user.password));
        if(err) {
            this.auditWebLoginFailure({user_id:parseInt(unique_key),message:err.message,role:user.user_type_code});
            TE(err.message);
        }
        if(!pass) {*/
        if(userInfo.password !== encryptUtil.decrypt(user.password)) {
            this.auditWebLoginFailure({user_id:parseInt(unique_key),message:'invalid password',role:user.user_type_code});
            TE('invalid password');
        }
        // Commented By Vamsi 27-05-2019
        // var loginKeys=await this.service.getLoginSuccessKeyFromSystemUserId(user.system_user_id);
        // if(loginKeys && loginKeys.length>0){
        //     this.auditWebLoginFailure({user_id:parseInt(unique_key),message:'An active session already associated with this user',role:user.user_type_code});
        //     TE('An active session already associated with this user');
        // }

        delete user['password'];
        return user;

    }

    async resetPassword(info){
        var result = await this.service.updateUserPassword(info);
        return result;
    }

    async findUser(phone){
        var usersArray = await this.service.findWebUser(phone);
        if(typeof(usersArray) == "undefined") {
            TE('Not a registered mobile number');
        }
        if(usersArray.length === 0) {
            TE('Not a registered mobile number');
        }
        return usersArray;
    }

    async logOutUser(req,sessionKey){
        var result = await this.service.logOutUser(req,sessionKey);
        return result;
    }
        
}

module.exports = AuthService;