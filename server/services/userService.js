var db = require('../db/db.js');
const { to, TE }    = require('./utilService');
const encryptUtil = require('../util/encryptUtil.js');

class UserService {
  constructor(){
    this.db=db;
  };

  async findUser (query) {
    const id=query;
    return await this.db.query('SELECT user_id,name,mob_user_key_id as user_key_id,mob_user_type_id as user_type_id,status,user_type_code,system_user_id, password FROM mob_user WHERE user_id = ? and status=?', [id,'a']);
  };

  async findWebUser (query) {
    const id=query;
    return await this.db.query('SELECT user_id,name,web_user_key_id as user_key_id,web_user_type_id as user_type_id,status,user_type_code,system_user_id, password, available_leaves FROM web_user WHERE user_id = ? and status=?', [id,'a']);
  };

  async findUserBySystemUserId (query) {
    const id=query;
    return await this.db.query('SELECT user_id,name,web_user_key_id as user_key_id,web_user_type_id as user_type_id,status,user_type_code,system_user_id, password, available_leaves FROM web_user WHERE system_user_id = ? and status=?', [id,'a']);
  };

  async getLoginSuccessKey (query) {
    const id=query;
    return await this.db.query(" SELECT web_login_key FROM web_login_suc WHERE status = 'a' and session_key = ? ", [id]);
  };

  async getLoginSuccessKeyFromSystemUserId (query) {
    const id=query;
    return await this.db.query(" SELECT web_login_key FROM web_login_suc WHERE status = 'a' and system_user_id = ?", [id]);
  };

  async getLoginSuccessKeyFromSystemUserIdInactive (query) {
    const id=query;
    return await this.db.query(" SELECT web_login_key FROM web_login_suc WHERE status = 'i' and system_user_id = ?", [id]);
  };
  
  async createUser (input) {
    const { name, phone, password, userType } = input
    var user_id = parseInt(phone);
    var usersArray=await this.findUser(user_id);
    if(usersArray.length>0){
      TE('Phone number already exists');
    }
    var sql='INSERT INTO `mob_user` (`user_id`,`name`,`created_dt`,`modified_dt`,`password`,`password_dt`,`password_ch_dt`,`status`,`mob_user_type_id`,`user_type_code`,`created_user`,`system_user_id`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    var values=[user_id,name,new Date(),new Date(),password,new Date(),new Date(),'a',parseInt(userType),parseInt(userType)*10,'admin',phone];
    var result= await this.db.query(sql,values);
    console.log(result);
    return {userId:phone,msg:`User added with ID: `+phone};
  };

  async createWebUser (input) {
    const { name, phone, password, userType } = input
    var user_id = parseInt(phone);
    var usersArray=await this.findWebUser(user_id);
    if(usersArray.length>0){
      TE('Phone number already exists');
    }
    var sql='INSERT INTO `web_user` (`user_id`,`name`,`created_dt`,`modified_dt`,`password`,`password_dt`,`password_ch_dt`,`status`,`web_user_type_id`,`user_type_code`,`created_user`,`system_user_id`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    var values=[user_id,name,new Date(),new Date(),password,new Date(),new Date(),'a',parseInt(userType),parseInt(userType)*10,'admin',phone];
    var result= await this.db.query(sql,values);
    console.log(result);
    return {userId:phone,msg:`User added with ID: `+phone};
  };


  async updateUser(inputId,input) {
    const id = parseInt(inputId)
    const { name, email } = input

    await this.db.query(
      'UPDATE mob_user SET name = ?, user_id = ? WHERE user_id = ?',
      [name, email, id])
    return `User modified with ID: ${id}`;
  };

  async updateUserPassword(input) {
    const { phone, password } = input;
    let encryptedPassword=encryptUtil.encrypt(password);
    await this.db.query(
      'UPDATE web_user SET password = ?, password_ch_dt = now() WHERE user_id = ?',
      [encryptedPassword, phone]);
    return `Password updated for user : ${phone}`;
  };



  async deleteUser(input) {
    const id = parseInt(input)
    await this.db.query('DELETE FROM mob_user WHERE user_id = ?', [id])
    return `User deleted with ID: ${id}`;
  };

  loginSuccess(loginsuccess){
    var sql='INSERT INTO `mob_login_suc` (`login_time`,`user_id`,`user_type_code`,`user_name`,`system_user_id`,`status`,`session_key`)  VALUES (?,?,?,?,?,?,?)';
    var values=[new Date(),loginsuccess.user_id,loginsuccess.role,loginsuccess.name,loginsuccess.suser_id,'a',loginsuccess.token];
    this.db.query(sql,values);
  }
  
  loginFailure(loginfail){
    var sql='INSERT INTO `mob_login_fail` (`user_id`,`reason`,`login_date`,`user_type_code`)  VALUES (?,?,?,?)';
    var values=[loginfail.user_id,loginfail.message,new Date(),loginfail.role];
    this.db.query(sql,values);
  }
  
  async webLoginSuccess(loginsuccess){
    await this.db.query(
      'UPDATE web_login_suc SET status = ? WHERE user_id = ? and status=?',
      ['i', loginsuccess.user_id, 'a']);

    var sql='INSERT INTO `web_login_suc` (`login_time`,`user_id`,`user_type_code`,`user_name`,`system_user_id`,`status`,`session_key`)  VALUES (?,?,?,?,?,?,?)';
    var values=[new Date(),loginsuccess.user_id,loginsuccess.role,loginsuccess.name,loginsuccess.suser_id,'a',loginsuccess.token];
    var result = await this.db.query(sql,values);
    console.log('web login success result');
  }
  
  webLoginFailure(loginfail){
    var sql='INSERT INTO `web_login_fail` (`user_id`,`reason`,`login_date`,`user_type_code`)  VALUES (?,?,?,?)';
    var values=[loginfail.user_id,loginfail.message,new Date(),loginfail.role];
    this.db.query(sql,values);
  }

  async logOutUser(req,sessionKey) {
    console.log('UserService In logout user')
    await this.db.query(
      "UPDATE web_login_suc SET status = 'i', logout_time = now() WHERE session_key = ?",
      [sessionKey]);
    return `Logout status updated for user : ${req.user.user_id}`;
  };
}

module.exports = UserService;