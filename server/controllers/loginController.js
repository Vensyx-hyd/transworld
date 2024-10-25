var AuthService = require('../services/authService.js')
const { to, ReE, ReS }  = require('../services/utilService');
var otp = require('../util/mobileOTPUtil');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('268309AxaGdQSE5c90973d','Otp for your login is {{otp}}, please do not share it with anybody');
var msg91 = require("msg91");//("268309T6Xv5YWg66e41222P1", "TGMODE", "4" )

class LoginController {
	constructor(){
		this.service = new AuthService();
		this.login=this.login.bind(this);
		this.forgotPassword=this.forgotPassword.bind(this);
		this.resetPassword=this.resetPassword.bind(this);
		this.createUser= this.createUser.bind(this);
		this.sendOTP=this.sendOTP.bind(this);
		this.logOut=this.logOut.bind(this);
	}

	/*async sendOTP(req,res) {
		console.log(req.params);
		console.log(req.params.phone);
		var result=await otp.sendOTP(req.params.phone);
		console.log(result);
		return ReS(res, {message:'Successfully sent the OTP to mobile: '+req.params.phone,user:user,token:token},200);
	}*/

	async sendOTP(req,res){	
		var phone = req.params.phone;
		let err,users;
		try {
			[err,users] = await this.service.findUser(phone);
		} catch (error) {
			return ReE(res, {message:error.message},400);
		}
		
		// console.log(err);
		// if(err){
		// 	return ReE(res, {message:err.message},400);
		// }
		sendOtp.send("91"+phone, "CFSIND", function (error, data) {
			if(error){
				throw new Error(error);
			}
			console.log(data);
		  });
		return ReS(res, {message:'Successfully sent the OTP to mobile: '+req.params.phone},200);
	}

	async retryOTP(req,res){	
		var phone = req.params.phone;
		sendOtp.retry("91"+phone, false, function (error, data) {
			if(error){
				throw new Error(error);
			}
			console.log(data);
		  });
		return ReS(res, {message:'Successfully resent the OTP to mobile: '+req.params.phone},200);
	}

	async verifyOTP(req,res){
		var phone = req.params.phone;
		var otp = req.params.otp;
		sendOtp.verify("91"+phone, otp, function (error, data) {
			if(error){
				throw new Error(error);
			}
			console.log(data); // data object with keys 'message' and 'type'
			if(data.type == 'success'){
				console.log('OTP verified successfully')
				return ReS(res, {message:'OTP verified successfully: '+req.params.phone},200);
			} 
			if(data.type == 'error') {
				console.log('OTP verification failed')
				return ReE(res, {message:'OTP verification failed: '+req.params.phone},400);
			}
		});
		
	}

	async login (req,res) {
		console.log(req.device.type);
		var deviceType=req.device.type;
		let user;
		if(deviceType==='phone') {
			try {
				user = await this.service.authWebUser(req.body);
			} catch (error) {
				return ReE(res, {message:error.message},400);
			}
			var token=await this.service.getJWT(user.user_id);
			await this.service.auditWebLoginSuccess({user_id:user.user_id,role:user.user_type_code,name:user.name,suser_id:user.system_user_id,token:token})
			return ReS(res, {message:'Successfully authenticated the user.',user:user,token:token},200);
		} else {
			try {
				user = await this.service.authWebUser(req.body);
				console.log("user :: ",user)
			} catch (error) {
				console.log("Error :: ",error)
				return ReE(res, {message:error.message},400);
			}
			var token=await this.service.getJWT(user.user_id);
			await this.service.auditWebLoginSuccess({user_id:user.user_id,role:user.user_type_code,name:user.name,suser_id:user.system_user_id,token:token})
			return ReS(res, {message:'Successfully authenticated the user.',user:user,token:token},200);
		}
	}

	async forgotPassword (req,res) {
	  console.log(req.params)
	  console.log(req.body)
	  var drivers =  await this.service.forgotPassword(req.params);
	  res.send(drivers);
	}

	async resetPassword (req,res) {
	  var status =  await this.service.resetPassword(req.body);
	  var user = await this.service.authWebUser(req.body);
	  var token=await this.service.getJWT(user.user_id);
	  msg91.send([user.user_id], "Your password has been successfully reset", function(err, response){
		console.log(err);
		console.log(response);
	  });
	  await this.service.auditWebLoginSuccess({user_id:user.user_id,role:user.user_type_code,name:user.name,suser_id:user.system_user_id,token:token})
	  return ReS(res, {message:'Successfully authenticated the user.',user:user,token:token},200);
	}

	async createUser(req,res) {
		//const {name,phone,password} = req.body;
		let err,user;
		var deviceType=req.device.type;
		if(deviceType==='phone') {
			[err, user] = await to(this.service.createWebUser(req.body));
			if(err) return ReE(res, err, 422);
			var token=await this.service.getJWT(user.user_id);
			await this.service.auditWebLoginSuccess({user_id:user.user_id,role:user.user_type_code,name:user.name,suser_id:user.system_user_id,token:token})
			return ReS(res, {message:'Successfully created new user.', token:token}, 201);
		} else {
			[err, user] = await to(this.service.createWebUser(req.body));
			if(err) return ReE(res, err, 422);
			var token=await this.service.getJWT(user.user_id);
			await this.service.auditWebLoginSuccess({user_id:user.user_id,role:user.user_type_code,name:user.name,suser_id:user.system_user_id,token:token})
			return ReS(res, {message:'Successfully created new user.', token:token}, 201);
		}
		
	}

	async logOut(req,res) {
		var sessionKey = req.header('Authorization');
		var result =  this.service.logOutUser(req,sessionKey);
		return ReS(res, {message:'Logged out successfully.'}, 200);
	}

}

module.exports=LoginController;