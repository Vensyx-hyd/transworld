'use strict';
var db = require('../db/db.js');
var UserService = require('../services/userService.js');

class TrailerService {
  constructor(){
    this.db=db;
    this.userService= new UserService();
  };

  // date_format(date(allot.`cfs_hire_trailer_alot_det_stat_dt`),'%d-%m-%Y')

  async getTrailers (){
    var result = await this.db.query("select det.`cfs_hire_trailer_det_id` as detId, det.`cfs_hire_trailer_det_no` as trailerNo, det.`cfs_hire_trailer_det_con_mob` as contactNo, det.`cfs_hire_trailer_det_rate` as rate,det.`cfs_hire_trailer_det_type` as type, det. `cfs_hire_trailer_det_status` as detStatus, det.`admin_vendor_id` as vendorId, det.`cfs_hire_trailer_det_ven_name` as vendorName, allot.`cfs_hire_trailer_alot_det_id` as allotId, allot.`cfs_hire_trailer_alot_det_stat_dt` as startDate, allot.`cfs_hire_trailer_alot_det_end_dt` as endDate, allot.`cfs_hire_trailer_alot_det_days` as days, allot.`cfs_hire_trailer_alot_det_status` as allotStatus,allot.`cfs_hire_trailer_alot_det_cr_dt` as created, allot.`cfs_hire_trailer_alot_det_mod_dt` as modified from cfs_hire_trailer_det det, cfs_hire_trailer_alot_det allot where det.cfs_hire_trailer_det_id=allot.cfs_hire_trailer_det_id");
   return result;
  };

  async getTrailerById (query){
    const {id} = query;
    var result = await this.db.query("select admin_driver_roaster_trailer_no as trailerNo from admin_driver_roaster where (date(sysdate()) between (date(admin_driver_roaster_st_dt)) and date(admin_driver_roaster_end_dt)) and admin_driver_roaster_dri_shift1_system_user_id= ? or admin_driver_roaster_dri_shift2_system_user_id= ? and admin_driver_roaster_status='A' ", [id, id]);
    return result;
  };

  async createTrailer (input,sessionKey) {
    const { vendorId, vendorName, trailerNo, contactNo, fromDate, toDate, days, rate, type } = input;
    var loginSuccessKeyArray=await this.userService.getLoginSuccessKey(sessionKey);
    var loginSuccessKey=loginSuccessKeyArray[0].web_login_key;
    var sql='INSERT INTO `cfs_hire_trailer_det` (`cfs_hire_trailer_det_no`, `cfs_hire_trailer_det_con_mob`, `cfs_hire_trailer_det_rate`,`cfs_hire_trailer_det_type`, `cfs_hire_trailer_det_status`, `admin_vendor_id`, `web_login_key`, `cfs_hire_trailer_det_ven_name`) VALUES (?,?,?,?,?,?,?,?)';
    var values=[trailerNo, contactNo, rate, type,'A',vendorId,loginSuccessKey,vendorName];
    var result= await this.db.query(sql,values);
    console.log(result)
    //if(result.OK) at later point of time
    var allotSql='INSERT INTO `cfs_hire_trailer_alot_det` (`cfs_hire_trailer_alot_det_stat_dt`, `cfs_hire_trailer_alot_det_end_dt`, `cfs_hire_trailer_alot_det_days`, `cfs_hire_trailer_alot_det_status`, `web_login_key_cr_user`, `cfs_hire_trailer_det_id`, `cfs_hire_trailer_alot_det_cr_dt`, `cfs_hire_trailer_alot_det_mod_dt`,`web_login_key_mod_user`) VALUES (?,?,?,?,?,?,?,?,?)';
    var allotValues=[new Date(fromDate), new Date(toDate), days,'A',loginSuccessKey,result.insertId,new Date(),new Date(),loginSuccessKey];
    var allotResult= await this.db.query(allotSql,allotValues);
    console.log(allotResult)
    return `Trailer added with ID: ${result.insertId}`;
  };

  async modifyTrailer (inputId,input,sessionKey) {
    const { fromDate, toDate, days, rate } = input;
    var loginSuccessKeyArray=await this.userService.getLoginSuccessKey(sessionKey);
    var loginSuccessKey=loginSuccessKeyArray[0].web_login_key;
    var result= await this.db.query('UPDATE cfs_hire_trailer_alot_det SET cfs_hire_trailer_alot_det_stat_dt = ?, cfs_hire_trailer_alot_det_end_dt = ?, cfs_hire_trailer_alot_det_days=?, web_login_key_mod_user=? ,cfs_hire_trailer_alot_det_mod_dt=? WHERE cfs_hire_trailer_det_id = ?',
    [new Date(fromDate), new Date(toDate), days, loginSuccessKey, new Date(), inputId]);
    result= await this.db.query('UPDATE cfs_hire_trailer_det SET cfs_hire_trailer_det_rate = ? WHERE cfs_hire_trailer_det_id = ?',
    [rate, inputId]);
    console.log(result);
    return `Trailer updated for ID: ${inputId}`;
  };
}

module.exports = TrailerService;