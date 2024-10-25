'use strict';
var db = require('../db/db.js');
var UserService = require('../services/userService.js');

class FuelService {
  constructor(){
    this.db=db;
    this.userService= new UserService();
  };
  
  async getFuelRequests (){
   var result = await this.db.query("select web_fuel_req_id as reqId, web_fuel_req_trail_no as trailerNo, web_fuel_req_km_done as kmDone, date_format(date(web_fuel_req_last_issue_dt),'%d-%m-%Y') as lastIssuedDate, web_fuel_req_last_issue_lt as lastIssuedLitre, web_fuel_req_req_lt as reqLitres, web_fuel_req_remarks as remarks, date_format(date(web_fuel_req_dt),'%d-%m-%Y') as reqDate from web_fuel_req where web_fuel_req_last_issue_dt is not null and web_fuel_req_last_issue_dt in ( select max(web_fuel_req_last_issue_dt) from web_fuel_req group by web_fuel_req_trail_no)");
   return result;
  };

  async createFuelRequest (input,sessionKey) {
    const { trailerNo, kmsDone, lastIssuedDate, lastIssuedLitres, reqLitres, remarks } = input;
    var loginSuccessKeyArray=await this.userService.getLoginSuccessKey(sessionKey);
    var loginSuccessKey=loginSuccessKeyArray[0].web_login_key;
    var sql='INSERT INTO `web_fuel_req` (`web_fuel_req_trail_no`, `web_fuel_req_km_done`, `web_fuel_req_last_issue_dt`, `web_fuel_req_last_issue_lt`, `web_fuel_req_req_lt`, `web_fuel_req_remarks`, `web_login_key`, `web_fuel_req_dt`) VALUES (?,?,?,?,?,?,?,?)';
    var values=[trailerNo, kmsDone, null, null, reqLitres, remarks, loginSuccessKey,new Date()];
    var result= await this.db.query(sql,values);
    console.log(result);
    var randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //if(result.OK) at later point of time 
    var qrSql='INSERT INTO `web_fuel_req_qrcode` (`web_fuel_req_qrcode_code`, `web_fuel_req_qrcode_req_lt`, `web_fuel_req_qrcode_req_type`, `web_fuel_req_id`, `web_login_key_approved`, `web_fuel_req_qrcode_dt`, `web_fuel_req_qrcode_status`) VALUES (?,?,?,?,?,?,?)';
    var qrValues=[randomString, reqLitres, 'WEB_REQ', result.insertId, loginSuccessKey,new Date(),'SCAN_PENDING'];
    var qrResult= await this.db.query(qrSql,qrValues);
    console.log(qrResult);
    return `Fuel Request added with ID: ${result.insertId}`;
  };

  async modifyFuelRequest (user,msgInfo,sessionKey) {
    const { driverNames, title } = msgInfo;
    //var values=[];
    var userId=user.user_key_id;
    var loginSuccessKey=await this.userService.getLoginSuccessKey(sessionKey);
    var values = driverNames.map((obj) => { 
      var value = [obj,new Date(),userId,loginSuccessKey[0].web_login_key,title];
      //values.push(value);
      return value;
    });
    var sql='INSERT INTO `cfs_msg_sent` (`cfs_msg_sent_dri_name`,`cfs_msg_sent_dt`,`web_user_key_id`,`web_login_key`,`cfs_msg_sent_title`)  VALUES ?';
    //var values=[driverName,new Date(),2,2,title];
    var result= await this.db.query(sql,[values]);
    console.log(result)
    return `Msg sent with ID: ${result.insertId}`;
  };

  async getFuelRequestsForApproval(){
    var result = await this.db.query("select wdr.`mob_diesal_req_id` as requestId, wu.name as name, wdr.`req_lit` as reqLitres, wdr.`status` as status, wdr.`req_dt` as reqDt, wdr.`req_loc` as reqLoc, wdr.`user_ass_trip_id` as assignTripNo, wdr.`km_done` as kmDone, uat.`trailor_no` as trailerNo from web_diesal_req wdr, user_assign_trip uat, web_user wu where uat.user_ass_trip_id = wdr.user_ass_trip_id and wu.user_id = wdr.user_id order by req_dt desc");
    return result;
  }

  async approveFuelRequests(req,sessionKey) {
    const { requestId, status}=req.body;
    var sql ="update web_diesal_req set status=?, diesel_approved_date = sysdate() where mob_diesal_req_id=?";
    var values = [status, requestId];
    var user = req.user;
    var result = await this.db.query(sql,values);
    console.log(result);
    // if(status === "Approved"){
      var randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      var loginSuccessKeyArray=await this.userService.getLoginSuccessKey(sessionKey);
      var loginSuccessKey=loginSuccessKeyArray[0].web_login_key;
      var reqArray = await this.db.query("select wdr.`mob_diesal_req_id` as reqId, wdr.`user_id` as userId, wdr.`req_lit` as reqLit, wdr.`status` as status, wdr.`req_dt` as reqDt, wdr.`req_loc` as reqLoc, wdr.`user_ass_trip_id` as tripId, wdr.`km_done` as kmDone from `web_diesal_req` wdr where wdr.mob_diesal_req_id=?",[requestId]);
      if(typeof(reqArray) != "undefined" && reqArray.length===1 && status === "Approved"){
        var req=reqArray[0];
        var qrSql='INSERT INTO `web_fuel_req_qrcode` (`web_fuel_req_qrcode_code`, `web_fuel_req_qrcode_req_lt`, `web_fuel_req_qrcode_req_type`, `mob_diesal_req_id`, `web_login_key_approved`, `web_fuel_req_qrcode_dt`, `web_fuel_req_qrcode_status`) VALUES (?,?,?,?,?,?,?)';
        var qrValues=[randomString, req.reqLit, 'MOB_REQ', requestId, loginSuccessKey,new Date(),'SCAN_PENDING'];
        var qrResult= await this.db.query(qrSql,qrValues);
        console.log(qrResult);
      }
    // }
    
    // Start Commented by Vamsi 25-05-2019
    // var sendMsgTitle='';
    // var usersArray=await this.db.query("select wu.name as name from web_diesal_req wdr,web_user wu where wdr.user_id=wu.user_id and wdr.mob_diesal_req_id=?",[requestId]);
    // if(usersArray){
    //   var reqUser=usersArray[0];
    //   if(status==="Approved") {
    //     sendMsgTitle="Fuel Approval";
    //   } else {
    //     sendMsgTitle="Fuel Rejected";
    //   }
    //   var sql='INSERT INTO `cfs_msg_sent` (`cfs_msg_sent_dri_name`,`cfs_msg_sent_dt`,`web_user_key_id`,`web_login_key`,`cfs_msg_sent_title`,`is_disabled`)  VALUES (?,?,?,?,?,?)';
    //   var values=[reqUser.name, new Date(), user.user_key_id,loginSuccessKey,sendMsgTitle,'N'];
    //   var result= await this.db.query(sql,values);
    // }
    // end
    return `Fuel request updated with ID: ${requestId}`;
  }

  async validateQrCode(user,input) {
    const { codeId, status}=input;
    var sql ="update web_fuel_req_qrcode set scanned_by=?, web_fuel_req_qrcode_status=?, web_fuel_req_qrcode_dt=now() where web_fuel_req_qrcode_id=?";
    var values = [user.user_id, status, codeId];
    var result = await this.db.query(sql,values);
    return `Scan request updated with ID: ${codeId}`;
  }

  async getQrCodes(){
    /*var result = await this.db.query("select * from ("
      +" select web_fuel_req_qrcode_id as codeId, web_fuel_req_qrcode_code as qrCode, web_fuel_req_qrcode_req_lt as reqLit,wfr.web_fuel_req_trail_no as trailerNo from web_fuel_req wfr, web_fuel_req_qrcode wfrq where wfrq.web_fuel_req_id = wfr.web_fuel_req_id and wfrq.web_fuel_req_qrcode_req_type = 'WEB_REQ' and wfrq.web_fuel_req_qrcode_status ='SCAN_PENDING' "
      +" union "
      +" select web_fuel_req_qrcode_id as codeId, web_fuel_req_qrcode_code as qrCode, web_fuel_req_qrcode_req_lt as reqLit,uat.trailor_no as trailerNo from web_diesal_req wdr, web_fuel_req_qrcode wfrq, user_assign_trip uat where wfrq.mob_diesal_req_id=wdr.mob_diesal_req_id and uat.user_ass_trip_id=wdr.user_ass_trip_id and wfrq.web_fuel_req_qrcode_req_type = 'MOB_REQ' and wfrq.web_fuel_req_qrcode_status ='SCAN_PENDING' ) qrcodes order by qrcodes.codeId asc");
    return result;*/

    var result = await this.db.query("select web_fuel_req_qrcode_id as codeId, web_fuel_req_qrcode_code as qrCode, web_fuel_req_qrcode_req_lt as reqLit,wfr.web_fuel_req_trail_no as trailerNo,drivers.name as driverName, web_fuel_req_dt as approvedDate from web_fuel_req wfr "+
                                     " inner join web_fuel_req_qrcode wfrq on wfrq.web_fuel_req_id = wfr.web_fuel_req_id "+
                                     " inner join ( select distinct wu.name ,uat.trailor_no from user_trips ut, user_assign_trip uat,web_user wu where ut.user_trip_id=uat.user_trip_id and uat.system_user_id=wu.system_user_id and uat.trip_status in ('TRIP_SCHEDULED','TRIP_IN_PROGRESS') and date_format(ut.exp_start_time,'%Y-%m-%d')=date_format(sysdate(),'%Y-%m-%d')) drivers on drivers.trailor_no=wfr.web_fuel_req_trail_no "+
                                     " where wfrq.web_fuel_req_qrcode_req_type = 'WEB_REQ' and wfrq.web_fuel_req_qrcode_status ='SCAN_PENDING' "+
                                     " union "+
                                     " select web_fuel_req_qrcode_id as codeId, web_fuel_req_qrcode_code as qrCode, web_fuel_req_qrcode_req_lt as reqLit,uat.trailor_no as trailerNo, wu.name as driverName,diesel_approved_date as approvedDate from web_diesal_req wdr, web_fuel_req_qrcode wfrq, user_assign_trip uat,web_user wu "+
                                     " where wfrq.mob_diesal_req_id=wdr.mob_diesal_req_id and uat.user_ass_trip_id=wdr.user_ass_trip_id and wfrq.web_fuel_req_qrcode_req_type = 'MOB_REQ' and wfrq.web_fuel_req_qrcode_status ='SCAN_PENDING' and uat.system_user_id=wu.system_user_id");
    return result;
  }

  async updateScannedFuelRequests(){
    var result = await this.db.query("select wdr.`mob_diesal_req_id` as requestId, wu.name as name, wdr.`req_lit` as reqLitres, wdr.`status` as status, wdr.`req_dt` as reqDt, wdr.`req_loc` as reqLoc, wdr.`user_ass_trip_id` as assignTripNo, wdr.`km_done` as kmDone, uat.`trailor_no` as trailerNo from web_diesal_req wdr, user_assign_trip uat, web_user wu where uat.user_ass_trip_id = wdr.user_ass_trip_id and wu.user_id = wdr.user_id order by req_dt desc");
    return result;
  }


}

module.exports = FuelService;