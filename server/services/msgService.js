'use strict';
var msg91 = require("msg91");//("268309T6Xv5YWg66e41222P1", "TGMODE", "4" )
var db = require('../db/db.js');
var UserService = require('../services/userService.js');
var smsService = require('../util/sendSMS.js');

class MsgService {
  constructor(){
    this.db=db;
    this.userService= new UserService();
    this.smsService=smsService;
  };

  
  async getMsg (query){
    const {id}=query;
    if(typeof id==='undefined'){
      return await this.db.query('SELECT * FROM cfs_msg_con where flag is null');
    } else {
      return await this.db.query('SELECT * FROM cfs_msg_con WHERE cfs_msg_con_id =?', [id]);
    }
  };

  async getMsgForUser (user,query){
    //const {id}=query;
    const userId = user.user_id;
    return await this.db.query("select cms.`cfs_msg_sent_id` as msgId, cms.`cfs_msg_sent_dri_name` as driverName, cms.`cfs_msg_sent_title` as msgTitle, cmc.`cfs_msg_con_body` as msgBody from cfs_msg_sent cms,cfs_msg_con cmc,web_user wu where cms.cfs_msg_sent_title = cmc.cfs_msg_con_title and cms.cfs_msg_sent_dri_name=wu.name and cms.is_disabled='N' and wu.user_id=? order by cms.cfs_msg_sent_dt desc", [userId]);
  };


  async createMsg (user, input, sessionKey) {
    const { title, body } = input;
    var userId=user.user_key_id;
    var loginSuccessKey=await this.userService.getLoginSuccessKey(sessionKey);
    var sql='INSERT INTO `cfs_msg_con` (`cfs_msg_con_body`,`cfs_msg_con_cr_dt`,`cfs_msg_con_status`,`web_login_key`,`web_user_key_id`,`cfs_msg_con_title`)  VALUES (?,?,?,?,?,?)';
    var values=[body,new Date(),'a',loginSuccessKey[0].web_login_key,userId,title];
    var result= await this.db.query(sql,values);
    console.log(result)
    return `Msg added with ID: ${result.insertId}`;
  };

  async sendMsg (user,msgInfo,sessionKey) {
    const { driverNames, title } = msgInfo;
    //var values=[];
    var userId=user.user_key_id;
    var loginSuccessKey=await this.userService.getLoginSuccessKey(sessionKey);

    var values = driverNames.map((obj) => { 
      var value = [obj,new Date(),userId,loginSuccessKey[0].web_login_key,title,'N'];
      //values.push(value);
      return value;
    });
    var sql='INSERT INTO `cfs_msg_sent` (`cfs_msg_sent_dri_name`,`cfs_msg_sent_dt`,`web_user_key_id`,`web_login_key`,`cfs_msg_sent_title`,`is_disabled`)  VALUES ?';
    //var values=[driverName,new Date(),2,2,title];
    var result= await this.db.query(sql,[values]);
    //this.smsService.sendSMS("This is a test Message sent by Sha Harsha. Please ignore it.",["919959810950","919985072038","919700680356"]);
    /*msg91.send(driverNames, "This is a test Message sent by Sha Harsha. Please ignore it.", function(err, response){
      console.log(err);
      console.log(response);
    });*/
    console.log(result)
    return `Msg sent with ID: ${result.insertId}`;
  };

  async disableMessage(user,query){
    const {msgId} = query;
    var sql = " UPDATE cfs_msg_sent set is_disabled='Y' where cfs_msg_sent_id =?";
    var result = await this.db.query(sql,[msgId]);
    return `Message Disabled`;
  }


}

module.exports = MsgService;