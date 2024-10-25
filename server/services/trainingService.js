'use strict';
var db = require('../db/db.js');
var UserService = require('../services/userService.js');

class TrainingService {
  constructor(){
    this.db=db;
    this.userService= new UserService();
  };

  
  async getTrainings (query){
    return await this.db.query('select `cfs_trng_det_id` as trainingId,`cfs_trng_det_name` as trainingName, `cfs_trng_det_tr_name` as trainerName, `cfs_trng_det_tr_loc` as trainingLoc, `cfs_trng_det_tr_days` as days, `cfs_trng_det_status` as status, `cfs_trng_type_id` as trainingType, `created_date` as createdDate, training_date as trainingDate from `cfs_trng_det`');
  };

  async getAllottedTrainings (user){
    const userName = user.name;
    return await this.db.query("select ctd.`cfs_trng_det_id` as trainingId, ctd.`cfs_trng_det_name` as trainingName, ctd.`cfs_trng_det_tr_name` as trainerName, ctd.`cfs_trng_det_tr_loc` as trainingLoc, ctd.`cfs_trng_det_tr_days` as days, ctd.`cfs_trng_det_status` as status, ctd.`cfs_trng_type_id` as trainingType, ctd.`created_date` as createdDate, ctd.training_date as trainingDate , cta.`cfs_trng_alot_id` as allotId, cta.`cfs_trng_alot_dvr_name` as driverName, cta.`cfs_trng_alot_st_dt` as allotStartDate, cta.`cfs_trng_alot_end_dt` as alotEndDate, cta.`cfs_trng_alot_status` as alotStatus, cta.`cfs_trng_alot_fb` as feedback, cta.`cfs_trng_alot_fb_rating` as fbRating, cta.`assigned_date` as assignedDate from `cfs_trng_det` ctd, `cfs_trng_alot` cta where ctd.cfs_trng_det_id=cta.cfs_trng_det_id and cta.`cfs_trng_alot_fb` is null and cta.`cfs_trng_alot_fb_rating` is null and cta.cfs_trng_alot_dvr_name=?",[userName]);
  };

  async createTraining (input,sessionKey) {
    const { trainingName, trainerName, trainingLoc, trainingDate, days, type } = input
    var loginSuccessKey=await this.userService.getLoginSuccessKey(sessionKey);
    var sql='INSERT INTO `cfs_trng_det` (`cfs_trng_det_name`, `cfs_trng_det_tr_name`, `cfs_trng_det_tr_loc`, `cfs_trng_det_tr_days`, `cfs_trng_det_status`, `web_login_key`, `cfs_trng_type_id`, `training_date`, `created_date`)  VALUES (?,?,?,?,?,?,?,?,?)';
    var values=[trainingName,trainerName,trainingLoc,days,'A', loginSuccessKey[0].web_login_key, type, new Date(trainingDate), new Date()];
    var result= await this.db.query(sql,values);
    console.log(result)
    return `Training added with ID: ${result.insertId}`;
  };

  async assignTraining (user,trainingInfo,sessionKey) {
    const { trainingId, driverNames, title } = trainingInfo;
    //var values=[];
    var userId=user.user_key_id;
    var loginSuccessKey = await this.userService.getLoginSuccessKey(sessionKey);
    var values = driverNames.map((obj) => { 
      var value = [obj, 'A', loginSuccessKey[0].web_login_key, trainingId, new Date()];
      //values.push(value);
      return value;
   });
   console.log('Values :::: ', values);
    var sql='INSERT INTO `cfs_trng_alot` (`cfs_trng_alot_dvr_name`,`cfs_trng_alot_status`,`web_login_key`,`cfs_trng_det_id`, `assigned_date`)  VALUES ?';
    //var values=[driverName,new Date(),2,2,title];
    var result= await this.db.query(sql,[values]);
    console.log(result)
    return `Training assigned sent with ID: ${result.insertId}`;
  };

  async feedback(user,info){
    const { status,rating, alotId} = info

    await this.db.query(
      'UPDATE cfs_trng_alot SET cfs_trng_alot_fb = ?, cfs_trng_alot_fb_rating = ? WHERE cfs_trng_alot_id = ?',
      [status, rating, alotId])
    return `Feedback updated: ${alotId}`;
  }


}

module.exports = TrainingService;