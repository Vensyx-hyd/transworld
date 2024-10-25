var db = require('../db/db.js');
var UserService = require('../services/userService.js');

class DriverService {
  constructor(){
    this.db=db;
    this.UserService= new UserService();
  };

  async getDriverById (query) {
    const id=query;
    return await this.db.query('SELECT * FROM mob_user WHERE user_id = ?', [id]);
  };

  async getDrivers (){
    return await this.db.query("select user_id as userId, name, name as value, name as label, web_user_key_id as userKeyId , system_user_id as systemUserId from web_user where web_user_type_id in (select web_user_type_id from web_user_type where upper(user_type) = 'DRIVER') and status = 'a' ");
  };

  async getDriversByRoaster (){
    return await this.db.query("select user_id as userId, name, name as value, name as label, web_user_key_id as userKeyId , system_user_id as systemUserId from web_user where web_user_type_id in (select web_user_type_id from web_user_type where upper(user_type) = 'DRIVER') and status = 'a' ");
  };

  async getDriversActive (){
    
    // return await this.db.query("select user_id as userId, name as driverName, web_user_key_id as userKeyId ,system_user_id, system_user_id as value, system_user_id as label from web_user where web_user_type_id in (select web_user_type_id from web_user_type where upper(user_type) = 'DRIVER') and status = 'a' ");
    // return await this.db.query("select system_user_id as label, system_user_id as value, name as driverName, shift from manual_attendence_shift");
    return await this.db.query("select wdm_Ecode as label, wdm_Ecode as value, wdm_Dname as driverName from web_driver_master");

  };

  // async getDriversEmpId (query){
  //   return await this.db.query("select user_id as userId, name, web_user_key_id as userKeyId , system_user_id as systemUserId, system_user_id as value, CONCAT(name,' - ',system_user_id) as label from web_user where web_user_type_id in (select web_user_type_id from web_user_type where upper(user_type) = 'DRIVER') ")
  // }

  async getDriversEmpId (){
    return await this.db.query("select user_id as userId, name, web_user_key_id as userKeyId , system_user_id as systemUserId, system_user_id as value, CONCAT(name,' - ',system_user_id) as label from web_user where user_type_code = '10' ")
  }

  async getDriversSystemUserId (){
    return await this.db.query("select user_id as userId, name, web_user_key_id as userKeyId , system_user_id as systemUserId, system_user_id as value, CONCAT(name,' - ',system_user_id) as label from web_user where web_user_type_id in (select web_user_type_id from web_user_type where upper(user_type) = 'DRIVER') and status = 'a' ");
  };

  async createDriver (input) {
    const { name, phone, password } = input
    var user_id = parseInt(phone);
    var sql='INSERT INTO `mob_user` (`user_id`,`name`,`created_dt`,`modified_dt`,`password`,`password_dt`,`password_ch_dt`,`status`,`mob_user_type_id`,`user_type_code`,`created_user`,`system_user_id`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    var values=[user_id,name,new Date(),new Date(),password,new Date(),new Date(),'a','1',1,'admin',''+user_id];
    var result= await this.db.query(sql,values);
    console.log(result)
    return `Driver added with ID: ${result.insertId}`;
  };

  async updateDriver(inputId,input) {
    const id = parseInt(inputId)
    const { name, email } = input

    await this.db.query(
      'UPDATE drivers SET name = ?, user_id = ? WHERE user_id = ?',
      [name, email, id])
    return `Driver modified with ID: ${id}`;
  };



  async deleteDriver(input) {
    const id = parseInt(input)
    await this.db.query('DELETE FROM drivers WHERE user_id = ?', [id])
    return `Driver deleted with ID: ${id}`;
  };

  async dieselRequest(user,deiselInfo,sessionKey){
    const { litres, reqLocation, kms, tripId}=deiselInfo;
    var userId=user.user_id;
    var countArray = await this.db.query("select count(*) as count from `web_diesal_req` wdr inner join web_fuel_req_qrcode wfrq  on wfrq.mob_diesal_req_id =wdr.mob_diesal_req_id where wdr.status in ('Approved','Pending') and wfrq.web_fuel_req_qrcode_status not in ('SCAN_SUCCESS') and wdr.user_id=? ",[userId]);
    var count = countArray[0].count;
    console.log(typeof(count),"typeof count");
    if(count !=="0" && count!==0){
      return `Not eligible to create new requests, due to existing requests`;
    } else {
      var loginSuccessKey=await this.UserService.getLoginSuccessKey(sessionKey);
      var sql='INSERT INTO `web_diesal_req` (`user_id`,`req_lit`,`status`,`req_dt`,`req_loc`,`web_login_key`,`km_done`,`user_ass_trip_id`,`is_discarded`)  VALUES (?,?,?,?,?,?,?,?,?)';
      var values=[userId,litres,'Pending',new Date(),reqLocation,loginSuccessKey[0].web_login_key,kms,tripId,'N'];
      var result= await this.db.query(sql,values);
      return `Diesel request added successfully ${result.insertId}`;
    }
    
  }

  async discardDieselRequest(deiselInfo){
    const { reqId }=deiselInfo;
    var sql="UPDATE `web_diesal_req` set is_discarded = 'Y' where mob_diesal_req_id =?";
    var values=[reqId];
    var result= await this.db.query(sql,values);
    return `Diesel request updated successfully ${reqId}`;
  }

  async getDieselRequests (query) {
    const {userId}=query;
    // if(id==='-1'){
    //   return await this.db.query('SELECT mob_diesal_req_id as reqId,approval_code FROM mob_diesal_req WHERE user_id = ? and status=?', [userId,'a']);
    // } else {
    //   return await this.db.query('SELECT * FROM mob_diesal_req WHERE user_id = ? and  mob_diesal_req_id =?', [userId,id]);
    // }

    return await this.db.query("select wdr.`mob_diesal_req_id` as reqId, wdr.`user_id` as userId, wdr.`req_lit` as reqLit, wdr.`status` as status, wdr.`req_dt` as reqDt, wdr.`req_loc` as reqLoc, wdr.`user_ass_trip_id` as tripId, wdr.`km_done` as kmDone,"
                              +" wfrq.`web_fuel_req_qrcode_id` as qrCodeId, wfrq.`web_fuel_req_qrcode_code` as qrCode, wfrq.`web_fuel_req_qrcode_req_lt` as qrCodeReqLt, wfrq.`web_fuel_req_qrcode_req_type` as reqType, wfrq.`web_fuel_req_qrcode_dt` as date,"
                              +" wfrq.`web_fuel_req_qrcode_status` as qrCodeStatus from `web_diesal_req` wdr left join `web_fuel_req_qrcode` wfrq on wdr.mob_diesal_req_id = wfrq.mob_diesal_req_id where "
                              +" wdr.user_id=? and wdr.is_discarded='N' and (wfrq.`web_fuel_req_qrcode_status` not in ('SCAN_SUCCESS') or wfrq.`web_fuel_req_qrcode_status` is null) "
                              +" union "
                              +" select wfr.web_fuel_req_id as reqId,null as userId, wfr.web_fuel_req_req_lt as reqLit, 'Approved' as status,sysdate() as reqDt, null as reqLoc,null as tripId,wfr.web_fuel_req_km_done as kmDone, wfrq.`web_fuel_req_qrcode_id` as qrCodeId,"
                              +" wfrq.`web_fuel_req_qrcode_code` as qrCode, wfrq.`web_fuel_req_qrcode_req_lt` as qrCodeReqLt, wfrq.`web_fuel_req_qrcode_req_type` as reqType, wfrq.`web_fuel_req_qrcode_dt` as date, wfrq.`web_fuel_req_qrcode_status` as qrCodeStatus from `web_fuel_req` wfr"
                              +" inner join (select uat.trailor_no from user_assign_trip uat, user_trips ut, web_user wu  where DATE_FORMAT(ut.exp_start_time,'%Y-%m-%d')=DATE_FORMAT(SYSDATE(),'%Y-%m-%d') and uat.trip_status not in ('TRIP_COMPLETED') and ut.user_trip_id=uat.user_trip_id "
                              +" and uat.system_user_id = wu.system_user_id and wu.user_id=? LIMIT 1) trailers on trailers.trailor_no = wfr.web_fuel_req_trail_no inner join  `web_fuel_req_qrcode` wfrq  on wfrq.web_fuel_req_id = wfr.web_fuel_req_id and wfrq.`web_fuel_req_qrcode_status` not in ('SCAN_SUCCESS') or wfrq.`web_fuel_req_qrcode_status` is null ",[userId,userId]);
  };

  async handOver(handOverInfo, sessionKey){
    const {dieselFlag,engFlag,radFlag,brkFlg,tyreFlag,batFlag,frWindFlag,kamPaFlag,revLampFlag,wiperFlag,hlWorFlag,smlrFlag,indFlag,sbFlag,reflFlag,denDamFlag,kmFlag,hoType}=handOverInfo;
    var loginSuccessKeyArray=await this.UserService.getLoginSuccessKey(sessionKey);
    var loginSuccessKey = loginSuccessKeyArray[0].web_login_key;
    var sql ='INSERT INTO `mob_handover` (`mob_ho_die_lvl_cq`,`mob_ho_eng_lvl_cq`,`mob_ho_rad_lvl_cq`,`mob_ho_brk_lvl_cq`,`mob_ho_tyre_lvl_cq`,`mob_ho_bat_lvl_cq`,`mob_ho_fr_wind`,`mob_ho_kam_pa_con`,`mob_ho_rev_lamp`,`mob_ho_wiper`,`mob_ho_hl_wor`,`mob_ho_smlr`,`mob_ho_ind`,`mob_ho_sb`,`mob_ho_refl`,`mob_ho_vi_den_dam`,`mob_ho_km_done`,`mob_login_key`,`mob_ho_type`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var values=[dieselFlag,engFlag,radFlag,brkFlg,tyreFlag,batFlag,frWindFlag,kamPaFlag,revLampFlag,wiperFlag,hlWorFlag,smlrFlag,indFlag,sbFlag,reflFlag,denDamFlag,kmFlag,loginSuccessKey,hoType];
    var result= await this.db.query(sql,values);
    return `Handover completed successfully`;
  }

  async handOverDetails(){
    return await this.db.query('select `mob_ho_id` as hoId,`mob_ho_die_lvl_cq` as dieselFlag,`mob_ho_eng_lvl_cq` as engFlag,`mob_ho_rad_lvl_cq` as radFlag ,`mob_ho_brk_lvl_cq` as brkFlg,`mob_ho_tyre_lvl_cq` as tyreFlag,`mob_ho_bat_lvl_cq` as batFlag,`mob_ho_fr_wind` as frWindFlag,`mob_ho_kam_pa_con` as kamPaFlag,`mob_ho_rev_lamp` as revLampFlag,`mob_ho_wiper` as wiperFlag,`mob_ho_hl_wor` as hlWorFlag,`mob_ho_smlr` as smlrFlag,`mob_ho_ind` as indFlag,`mob_ho_sb` as sbFlag,`mob_ho_refl` as reflFlag,`mob_ho_vi_den_dam` as denDamFlag,`mob_ho_km_done` as kmFlag,`mob_ho_type` as hoType  from mob_handover',);
  }

  async handOverDetailsById(userId,query){
    const {id}=query;
    return await this.db.query('select `mob_ho_id` as hoId,`mob_ho_die_lvl_cq` as dieselFlag,`mob_ho_eng_lvl_cq` as engFlag,`mob_ho_rad_lvl_cq` as radFlag ,`mob_ho_brk_lvl_cq` as brkFlg,`mob_ho_tyre_lvl_cq` as tyreFlag,`mob_ho_bat_lvl_cq` as batFlag,`mob_ho_fr_wind` as frWindFlag,`mob_ho_kam_pa_con` as kamPaFlag,`mob_ho_rev_lamp` as revLampFlag,`mob_ho_wiper` as wiperFlag,`mob_ho_hl_wor` as hlWorFlag,`mob_ho_smlr` as smlrFlag,`mob_ho_ind` as indFlag,`mob_ho_sb` as sbFlag,`mob_ho_refl` as reflFlag,`mob_ho_vi_den_dam` as denDamFlag,`mob_ho_km_done` as kmFlag,`mob_ho_type` as hoType  from mob_handover where mob_ho_id = ?', [id]);
  }

  async attendanceManual(req) {
    const { eCode, name, shift, date, time } = req.body;
    var sql ='INSERT INTO `manual_attendence` (`system_user_id`,`driver_name`,`shift`,`date`,`time`) VALUES (?,?,?,?,?)';    
    var values=[eCode, name, shift, date, time];
    var result= await this.db.query(sql,values);
    return `Added details successfully`;
  }

  async attendanceDetails(req) {
    const {type}=req.body;
    const userId=req.user.user_key_id;
    var sql ='INSERT INTO `attend_details` (`attend_det_dt`,`attend_det_intime`,`attend_det_type`,`mob_user_key_id`) VALUES (?,?,?,?)';
    var values=[new Date(),new Date().toLocaleTimeString(),type,userId];
    var result= await this.db.query(sql,values);
    return `Added details successfully`;
  }

  async getAttendanceDetails(req){
    const userId=req.user.user_key_id;
    if(req.query.from && req.query.to){
      const {from,to}=req.query;
      return await this.db.query("select attend_det_id as detId, date_format(date(attend_det_dt),'%d/%m/%Y') as date, attend_det_intime as intime ,attend_det_type as type from attend_details where mob_user_key_id=? and DATE(attend_det_dt) between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y') ",[userId,from,to]);
      // return await this.db.query("select attend_det_id_mob as detId, date_format(date(attend_det_dt),'%d/%m/%Y') as date, attend_det_intime as intime ,attend_det_type as type from attend_details_mob where mob_user_key_id=? and DATE(attend_det_dt) between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')",[userId,from,to]);
    }
    var result=await this.db.query("select attend_det_id as detId, date_format(date(attend_det_dt),'%d/%m/%Y') as date, attend_det_intime as intime ,attend_det_type as type from attend_details where mob_user_key_id=? and DATE(attend_det_dt) > (NOW() - INTERVAL 7 DAY) ",[userId]);
    // var result=await this.db.query(" select attend_det_id_mob as detId, date_format(date(attend_det_dt),'%d/%m/%Y') as date, attend_det_intime as intime, attend_det_type as type from attend_details_mob where mob_user_key_id=? and DATE(attend_det_dt) > (NOW() - INTERVAL 7 DAY)",[userId]);
    return result;
  }

  async getLatestAttendanceDetails(req){
    const userId=req.user.user_key_id;
    if(req.query.from && req.query.to){
      const {from,to}=req.query;
      return await this.db.query("select date_format(date(`attend_det_dt`),'%d-%m-%Y') as date, concat(attend_det_dt,' | ',attend_det_intime)as I, concat(attend_outdate,' | ',attend_det_outtime) as O from attend_details_temp where mob_user_key_id = ? and DATE(attend_det_dt) between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')",[userId,from,to]);
    }
    var result=await this.db.query("select date_format(date(`attend_det_dt`),'%d-%m-%Y') as date, concat(attend_det_dt,' | ',attend_det_intime)as I, concat(attend_outdate,' | ',attend_det_outtime) as O from attend_details_temp where mob_user_key_id = ? and DATE(attend_det_dt) > (NOW() - INTERVAL 7 DAY);",[userId]);
    return result;
  }

  async getProfile(user){
    return await this.db.query('select `wdm_id` as masterUserId, `wdm_Dname` as driverName,  `wdm_Ecode` as eCode,  `wdm_con_mob_no` as contactNo, `wdm_fname` as fatherName, `wdm_alt_mob_num` as altContactNo, `wdm_dob` as dob, `wdm_Paddress` as permanentAddress,  `wdm_Caddress` as currentAddress,  `wdm_DL_no` as dlNo, `wdm_DL_validity` as dlValidity, `wdm_doj` as doj, `wdm_PAN` as pan, `wdm_Adhaar` as aadhar,  `wdm_Bank_acc_no` as accountDetails, `wdm_PF_no` as pf,  `wdm_ESIC_no` as esicNo,  `wdm_Remarks` as remarks, `wdm_entry_dt` as entryDate, `wdm_Status` as status  from web_driver_master wdm , web_user wu where wdm.wdm_Ecode = wu.system_user_id and wu.user_id = ?',[user.user_id]);
  }

  async editProfile(inputId, input) {
    const { name, email, contactNo, address } = input

    await this.db.query(
      'UPDATE web_driver_master SET wdm_Dname = ?, wdm_con_mob_no = ?, wdm_Paddress=? WHERE wdm_id = ?',
      [name, contactNo, address, inputId])
    return `Profile updated with eCode: ${inputId}`;
  };

  async getMaintenanceRequests(user){
    return await this.db.query("select wun.`web_user_notify_id` as mainId, `user_ass_trip_id` as assignTripId, `web_notify_type_id` as notifyTypeId, (select web_notify_type_code from web_notify_type wnt where wnt.web_notify_type_id=wun.web_notify_type_id) as notifyType, `created_loc` as createdLoc, `status` as status,`approved_by` as approvedBy, `approved_on` as approvedOn from web_user_notify wun where wun.status not in ('Completed','Rejected') and wun.user_id=? ",[user.user_id]);
  }

  async getSchMaintenanceRequests(user){
    return await this.db.query(" select wtm.web_trail_main_id as mainId, null as assignTripId, 7 as notifyTypeId, 'Full Maintenance' as notifyType, null as createdLoc,  wtm.web_trail_main_status as status,'System Default' as approvedBy, DATE_FORMAT(wtm.web_trail_main_due_ser_dt,'%Y-%m-%d') as approvedOn from web_trail_main wtm  inner join (select uat.trailor_no from user_assign_trip uat, user_trips ut, web_user wu  where DATE_FORMAT(ut.exp_start_time,'%Y-%m-%d')=DATE_FORMAT(SYSDATE(),'%Y-%m-%d') and " 
    + " ut.user_trip_id=uat.user_trip_id and uat.system_user_id = wu.system_user_id and wu.user_id=? LIMIT 1) trailers on trailers.trailor_no = wtm.web_trail_main_trail_no where wtm.web_trail_main_due_ser_dt between NOW() and (NOW() + INTERVAL 3 DAY)",[user.user_id]);
  }

  async modifyMaintenanceRequest(input) {
    const { inputId, notifyTypeId, status } = input;
    if (notifyTypeId === 7 || notifyTypeId === "7") {
      await this.db.query(
        'UPDATE web_trail_main SET web_trail_main_status = ?, last_updated = ? WHERE web_trail_main_id = ?',
        [status, new Date(),inputId])

    } else{
      await this.db.query(
        'UPDATE web_user_notify SET status = ? WHERE web_user_notify_id = ?',
        [status, inputId])
          }
    return `Maintenance Request updated with ID: ${inputId}`;

  };

  async createMaintenanceRequest(req) {
    const {type}=req.body;
    const userId=req.user.user_key_id;
    var sql ='INSERT INTO `attend_details` (`attend_det_dt`,`attend_det_intime`,`attend_det_type`,`mob_user_key_id`) VALUES (?,?,?,?)';
    var values=[new Date(),new Date().toLocaleTimeString(),type,userId];
    var result= await this.db.query(sql,values);
    return `Added details successfully`;
  }

  async createNotify(req,sessionKey) {
    const {assignTripNo,notifyType,loc}=req.body;
    const userId = req.user.user_id;
    var loginSuccessKeyArray=await this.UserService.getLoginSuccessKey(sessionKey);
    var loginSuccessKey = loginSuccessKeyArray[0].web_login_key;
    var sql ='INSERT INTO `web_user_notify` (`user_ass_trip_id`,`crated_dt`,`web_notify_type_id`,`web_login_key`,`created_loc`,`status`,`user_id`) VALUES (?,?,?,?,?,?,?)';
    var values=[assignTripNo, new Date(), notifyType, loginSuccessKey, loc,'Pending',userId];
    var result= await this.db.query(sql,values);
    return `Notification details added successfully with ID: ${result.insertId}`;
  }

  async approveNotify(req,sessionKey) {
    const {status,notifyId}=req.body;
    const userId = req.user.user_id;
    var user = req.user;
    var loginSuccessKeyArray=await this.UserService.getLoginSuccessKey(sessionKey);
    var loginSuccessKey=loginSuccessKeyArray[0].web_login_key;
    // Added Sysdate() instead of now() in approved_on by vamsi 24-05-2019
    await this.db.query('UPDATE `web_user_notify` set status=?, approved_by=?, approved_on=sysdate() where web_user_notify_id =?', 
    [status,userId,notifyId]);
    // Start Commented by Vamsi 24-05-2019
    // var notifyReqs = await this.db.query(" select wu.name as name from web_user_notify wun,web_user wu where wu.user_id=wun.user_id and wun.web_user_notify_id",[notifyId])
    // var sendMsgTitle='';
    // if(notifyReqs){
    //   var notifyReq=notifyReqs[0];
    //   if(status==="Approved") {
    //     sendMsgTitle="Maintenance Approval";
    //   } else {
    //     sendMsgTitle="Maintenance Rejected";
    //   }
    //   var sql='INSERT INTO `cfs_msg_sent` (`cfs_msg_sent_dri_name`,`cfs_msg_sent_dt`,`web_user_key_id`,`web_login_key`,`cfs_msg_sent_title`,`is_disabled`)  VALUES (?,?,?,?,?,?)';
    //   var values=[notifyReq.name, new Date(), user.user_key_id,loginSuccessKey,sendMsgTitle,'N'];
    //   var result= await this.db.query(sql,values);
    // }
    // end
    return `Approved ID: ${notifyId}`;
  }

  async getNotifyForApproval(){
    // and wun.status='Pending'
    return await this.db.query("select wun.`web_user_notify_id` as notifyId, wu.name as driverName, wun.`user_ass_trip_id` as assignTripId, uat.trailor_no as trailerNo, `crated_dt` as created, `web_notify_type_id` as notifyTypeId, (select web_notify_type_code from web_notify_type wnt where wnt.web_notify_type_id=wun.web_notify_type_id) as notifyType, `created_loc` as createdLoc, wun.`status` as status,`approved_by` as approvedBy, `approved_on` as approvedOn from web_user_notify wun, user_assign_trip uat, web_user wu where uat.user_ass_trip_id=wun.user_ass_trip_id and wu.system_user_id=uat.system_user_id order by crated_dt desc");
  }

  async getNotifyForUser(user){
    return await this.db.query("select wun.`web_user_notify_id` as notifyId, `user_ass_trip_id` as assignTripId, `crated_dt` as created, `web_notify_type_id` as notifyTypeId, (select web_notify_type_code from web_notify_type wnt where wnt.web_notify_type_id=wun.web_notify_type_id) as notifyType, `created_loc` as createdLoc, `status` as status,`approved_by` as approvedBy, `approved_on` as approvedOn from web_user_notify wun where wun.user_id=?",[user.user_id]);
  }

  async getSeq (){
    var result = await this.db.query("select trip_dt.trip_id as tripId,trip_dt.wdm_Dname as driverName, null as uniformCheck, null as sBeltCheck, trip_dt.trailer_no as trailerNo,trip_dt.status as status from ( select a.user_trip_id as trip_id,b.wdm_Dname,a.trailor_no as trailer_no,0 as status,sysdate() as date from user_assign_trip a,web_driver_master b where b.wdm_Ecode = a.system_user_id and  a.trip_status = 'TRIP_IN_PROGRESS' and date(a.act_start_time) = date(sysdate()) ) trip_dt  where trip_dt.trip_id not in(select trip_id from sec_check_details where status=1)");
    console.log(result);
    return result;
    };



  async getSeqById (query) {
    const {id} = query;
    var result= await this.db.query('select `seq_id` as seqId,`trip_id` as tripId,`driver_name` as driverName,`uniform_check` as uniformCheck,`seat_belt_check` as sBeltCheck,`status` as status,`date` as date from sec_check_details where seq_id = ?', [id]);
    console.log(result);
    return result;
   };

  
  async createSeq (input) {
    const { tripId, uniformCheck, sBeltCheck, trailerNo, driverName } = input;
    var sql='INSERT INTO `sec_check_details` (`trip_id`,`driver_name`,`uniform_check`,`seat_belt_check`,`status`,`date`,`trailer_no`)  VALUES (?,?,?,?,?,?,?)';
    var values=[tripId, driverName, uniformCheck, sBeltCheck, '1', new Date(), trailerNo];
    var result= await this.db.query(sql,values);
    console.log(result);
    return `Security Check Details added with ID: ${result.insertId}`;
  };

  async updateSeq(inputId,input) {
    const id = parseInt(inputId)
    const { uniformCheck, sBeltCheck } = input

    await this.db.query(
      'UPDATE sec_check_details SET uniform_check = ?, seat_belt_check = ? WHERE seq_id = ?',
      [uniformCheck, sBeltCheck, id])
    return `Security Check Details modified with ID: ${id}`;
  };

  async getExe (){
    /** Added by Harsha on 20/10/2019 for adding containerType,containers data */    
    // var result = await this.db.query("select trip_dt.trip_id as tripId, trip_dt.wdm_Dname as driverNo, null as meCheckType, trip_dt.trailer_no as trailerNo, trip_dt.status as status, trip_dt.container_type as containerType, trip_dt.container_1 as container1, trip_dt.container_2 as container2, trip_dt.from_loc as fromLoc, trip_dt.to_loc as toLoc from ( select a.user_trip_id as trip_id,b.wdm_Dname,a.trailor_no as trailer_no,0 as status,sysdate() as date, at.container_type as container_type, ut.cont_no as container_1, ut.cont_no_2 as container_2, (select loc_name from location where loc_id=ut.start_loc_id) as from_loc,(select loc_name from location where loc_id=ut.end_loc_id) as to_loc from user_assign_trip a, admin_trip at, user_trips ut, web_driver_master b where b.wdm_Ecode = a.system_user_id and  a.trip_status = 'TRIP_IN_PROGRESS' and date(a.act_start_time) = date(sysdate()) and ut.user_trip_id=a.user_trip_id and at.admin_trip_id=ut.admin_trip_id ) as trip_dt where trip_dt.trip_id not in(select trip_id from exe_check_details where status=1)");
    var result = await this.db.query("select trip_dt.trip_id as tripId, trip_dt.wdm_Dname as driverNo, null as meCheckType, trip_dt.trailer_no as trailerNo, trip_dt.x as trip_type,  trip_dt.from_loc as fromLoc, trip_dt.to_loc as toLoc from ( select a.user_trip_id as trip_id,b.wdm_Dname,a.trailor_no as trailer_no,0 as status,sysdate() as date, (select loc_name from location where loc_id=ut.start_loc_id) as from_loc, (select loc_name from location where loc_id=ut.end_loc_id) as to_loc, (CASE ut.trip_type_code   WHEN 1 THEN 'Empty'  WHEN 2 THEN 'Loaded'    WHEN 3 THEN 'Empty Container'   else   '0'    END ) as x from user_assign_trip a, admin_trip at, user_trips ut, web_driver_master b where b.wdm_Ecode = a.system_user_id and a.trip_status = 'TRIP_IN_PROGRESS' and date(a.act_start_time) = date(sysdate()) and ut.user_trip_id=a.user_trip_id and at.admin_trip_id=ut.admin_trip_id ) as trip_dt where trip_dt.trip_id not in(select trip_id from exe_check_details where status=1)");
    console.log(result);
    return result;
  };

  async getExeById (query) {    
    const {id}=query;
    var result= await this.db.query('select `seq_id` as seqId, `trip_id` as tripId, `trailer_no` as trailerNo, `driver_name` as driverNo, `movement_exc_check_type` as meCheckType, `status` as status, `date_time` as dateTime from exe_check_details where seq_id = ?', [id]);
    console.log(result);
    return result;
  
  };

  
  async createExe (input) {
    const { tripId, trailerNo, driverNo, meCheckType, containerType, container1, container2 } = input
    //var user_id = parseInt(phone);
    var sql='INSERT INTO `exe_check_details` (`trip_id`, `trailer_no`, `driver_name`, `movement_exc_check_type`, `container_type`, `container1`, `container2`, `status`, `date_time`)  VALUES (?,?,?,?,?,?,?,?,?)';
    var values=[tripId, trailerNo, driverNo, meCheckType, containerType, container1, container2, '1' , new Date()];
    var result= await this.db.query(sql,values);
    console.log(result)
    return `Exe Check Details added with ID: ${result.insertId}`;
  };




  async updateExe(inputId,input) {
    const id = parseInt(inputId);
    const { meCheckType, containerType, container1, container2 } = input;

    await this.db.query(
      'UPDATE exe_check_details SET movement_exc_check_type = ?, container_type=?, container1=?, container2=? WHERE seq_id = ?',
      [ meCheckType, containerType, container1, container2, id])
    return `Exe Check Details modified with ID: ${id}`;
  };

}

module.exports = DriverService;