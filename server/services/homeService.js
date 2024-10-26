'use strict';
var db = require('../db/db.js');
var TripService = require('../services/tripService.js')

class HomeService {
  constructor(){
    this.db=db;
    this.tripService=new TripService();
  };

  async getTrailers () {
    return await this.db.query("select  `ceo_tr_all`  as all_trailers, `ceo_tr_run` as on_move, `ceo_tr_ideal` as on_idle, `ceo_tr_main` as on_maintenance  from ceo_trailer_report ");//ceo_trailer_report
  };

  async getDrivers (){
    // return await this.db.query("select ceo_dr_pay as on_pay , ceo_dr_shift as on_trip, ceo_dr_ideal as on_idle, ceo_dr_leave as on_leave,ceo_dr_abs as on_absent from ceo_driver_report ");//where date(ceo_dr_dt)=date(sysdate())
    // return await this.db.query("select ceo_dr_pay as on_pay , ceo_dr_shift as on_trip, ceo_dr_ideal as on_idle, ceo_dr_leave as on_leave, ceo_dr_abs as on_absent, ceo_driver_shift1 as shift1_cnt,ceo_driver_shift2 as shift2_cnt,ceo_driver_shift2_leave as shift2_leave,ceo_driver_shift2_absent as shift2_absent,ADDTIME(ceo_dr_dt, '5:30') as date from ceo_driver_report");//where date(ceo_dr_dt)=date(sysdate()) Commented idle field
    
    // return await this.db.query("select ceo_dr_shift as on_trip, ceo_dr_pr as shift1_present, ceo_dr_pr_shift2 as shift2_present, ceo_dr_abs as shift1_absent, ceo_driver_shift2_absent as shift2_absent, ceo_dr_leave as shift1_leave, ceo_driver_shift2_leave as shift2_leave, ceo_dr_excess_shift1 as shift1_excess, ceo_dr_excess_shift2 as shift2_excess, ceo_dr_pay as on_pay , ceo_driver_shift1 as shift1_cnt, ceo_driver_shift2 as shift2_cnt, ADDTIME(ceo_dr_dt, '5:30') as date from ceo_driver_report");   
    
    return await this.db.query("select ceo_dr_shift as on_trip, ceo_dr_pr as shift1_present, ceo_dr_pr_shift2 as shift2_present, ceo_dr_abs as shift1_absent, ceo_driver_shift2_absent as shift2_absent, ceo_dr_leave as shift1_leave, ceo_driver_shift2_leave as shift2_leave, ceo_dr_pay as on_pay , ceo_driver_shift1 as shift1_cnt, ceo_driver_shift2 as shift2_cnt, ADDTIME(ceo_dr_dt, '5:30') as date from ceo_driver_report");

    // return await this.db.query("select ceo_dr_shift as on_trip, ceo_dr_pr as current_present, ceo_dr_abs as current_absent, ceo_dr_leave as current_leave, ceo_dr_pay as on_pay , ceo_driver_shift1 as shift1_cnt, ceo_driver_shift2 as shift2_cnt, ADDTIME(ceo_dr_dt, '5:30') as date from ceo_driver_report");
  };

  async getTrips(){
    return await this.tripService.getTrips();
  }

  async getDriverPerformance () {
    return await this.db.query("select ceo_dtr_one as driver_1,ceo_dtr_two as driver_2,ceo_dtr_three as driver_3 ,ceo_dtr_four as driver_4, ceo_dtr_fiveplus as driver_5, ceo_dtr_dt as date  from  ceo_driver_trip_report where substr(ceo_dtr_dt,1,10) in (substr(now(),1,10),substr(DATE_SUB(now(), INTERVAL 1 DAY),1,10), substr(DATE_SUB(now(), INTERVAL 2 DAY),1,10))");
    // return await this.db.query("select ceo_dtr_one as driver_1,ceo_dtr_two as driver_2,ceo_dtr_three as driver_3 ,ceo_dtr_four as driver_4, ceo_dtr_fiveplus as driver_5, ceo_dtr_dt as date  from  ceo_driver_trip_report ");//where date(ceo_dtr_dt)=date(sysdate())
  };

  async getTrailerPerformance (){
    return await this.db.query("select ceo_tpr_trips as trips_done ,ceo_tpr_fuel_spent as  diesel_issued from ceo_trailer_per_report where substr(ceo_tpr_dt,1,10) in (substr(now(),1,10),substr(DATE_SUB(now(), INTERVAL 1 DAY),1,10), substr(DATE_SUB(now(), INTERVAL 2 DAY),1,10))");//where date(ceo_tpr_dt)=date(sysdate())
  };

  async getTripPerformance (){
    return await this.db.query("select ceo_tdr_planned, ceo_tdr_loaded, ceo_tdr_empty, ceo_tdr_issign, ceo_tdr_exp_com as completed, ceo_tdr_pending as pending, null as pending_prob, ceo_tdr_dt as date from ceo_trips_day_report where substr(ceo_tdr_dt,1,10) in (substr(now(),1,10),substr(DATE_SUB(now(), INTERVAL 1 DAY),1,10), substr(DATE_SUB(now(), INTERVAL 2 DAY),1,10))")
    // return await this.db.query("select ceo_tdr_planned as planned, ceo_tdr_loaded as loaded, ceo_tdr_empty as empt, ceo_tdr_issign as assigned, ceo_tdr_exp_com as completed, ceo_tdr_pending as pending, null as pending_prob, ceo_tdr_dt as date from ceo_trips_day_report");//where date(ceo_tdr_dt)=date(sysdate())
  };

  async getProfile(user){
    return await this.db.query('select `wcfsm_id` as masterUserId, `wcfsm_name` as driverName,  `wcfsm_Ecode` as eCode,  `wcfsm_con_mob_no` as contactNo, `wcfsm_fname` as fatherName, `wcfsm_alt_mob_num` as altContactNo, `wcfsm_dob` as dob, `wcfsm_Paddress` as permanentAddress,  `wcfsm_Caddress` as currentAddress,  `wcfsm_DL_no` as dlNo, `wcfsm_blood_group` as bloodGroup, `wcfsm_PAN` as pan, `wcfsm_Adhaar` as aadhar,  `wcfsm_Bank_acc_no` as accountDetails, `wcfsm_PF_no` as pf,  `wcfsm_ESIC_no` as esicNo,  `wcfsm_Remarks` as remarks, `wcfsm_entry_dt` as entryDate, `wcfsm_Status` as status  from web_cfs_master wcfsm , web_user wu where wcfsm.wcfsm_Ecode = wu.system_user_id and wu.user_id = ?',[user.user_id]);
  }

  async editProfile(inputId, input) {
    const { name, email, contactNo, address } = input

    await this.db.query(
      'UPDATE web_cfs_master SET wcfsm_name = ?, wcfsm_con_mob_no = ?, wcfsm_Paddress=? WHERE wcfsm_Ecode = ?',
      [name, contactNo, address, inputId])
    return `Profile updated with eCode: ${inputId}`;
  };

  async getMsg (){
    var result = await this.db.query('select `cfs_dri_msg_id` as dMsgId , `mob_user_notify_id` as notifyId, `mob_notify_type_id` as typeId, `mob_login_key` loginKey, `Driv_name` DrivName, `notify_desc` notifyDesc, `Cfs_sri_msg_cr_dt` as msgCrDt, `msg_receiving_status` as msgRecStatus, `msg_removing_status` as msgRemStatus from cfs_dri_msg' );
    //console.log(result);
    return result;
  };
  
  async getMsgById (query){
    const {id}=query;
    var result = await this.db.query('select `cfs_dri_msg_id` as dMsgId , `mob_user_notify_id` as notifyId, `mob_notify_type_id` as typeId, `mob_login_key` loginKey, `Driv_name` DrivName, `notify_desc` notifyDesc, `Cfs_sri_msg_cr_dt` as msgCrDt, `msg_receiving_status` as msgRecStatus, `msg_removing_status` as msgRemStatus from cfs_dri_msg where cfs_dri_msg_id = ?', [id]);
    console.log(result);
    return result;
  };

  async messageDelete (inputId) {
    const id = parseInt(inputId)
    var result= await this.db.query('DELETE FROM cfs_dri_msg where cfs_dri_msg_id = ?', [id]);
    console.log(result);
    return `Message Deleted for ID: ${inputId}`;
  };

  async getRunningLocation (){        
    // return await this.db.query("select a.id, concat('Trip No: ',a.trip_no, ' | Trailer No: ', a.trailer_no,' | Driver Name: ', a.driver_name) as shelter,CONVERT(SUBSTRING_INDEX(a.loc_coordinate_lat_long, ',', 1),DECIMAL(10,6)) as latitude, CONVERT(SUBSTRING_INDEX(a.loc_coordinate_lat_long, ',', -1),DECIMAL(10,6)) as longitude, case trip_status when 'TRIP_COMPLETED' then 'IDLE' when 'TRIP_IN_PROGRESS' then 'RUNNING' end as status from live_track a,user_assign_trip b where a.created_date_time in(select max(created_date_time) from live_track group by trailer_no) and a.trip_no=b.user_trip_id AND TIMESTAMPDIFF(MINUTE,(a.created_date_time),SYSDATE())<30 group by a.trailer_no");
    return await this.db.query("select a.id, concat('Trip No: ',a.trip_no, ' | Trailer No: ', a.trailer_no,' | Driver Name: ', a.driver_name) as shelter, CONVERT(SUBSTRING_INDEX(a.loc_coordinate_lat_long, ',', 1),DECIMAL(10,6)) as latitude, CONVERT(SUBSTRING_INDEX(a.loc_coordinate_lat_long, ',', -1),DECIMAL(10,6)) as longitude, case trip_status when 'TRIP_COMPLETED' then 'IDLE' when 'TRIP_IN_PROGRESS' then 'RUNNING' end as status from live_track a,user_assign_trip b where a.created_date_time in(select max(created_date_time) from live_track group by trailer_no) and a.trip_no=b.user_trip_id and date(a.created_date_time) = date(addtime(SYSDATE(),'5:30')) group by a.trailer_no");
  };

  async getIdleLocation (){        
    return await this.db.query("select concat('Trailer No.',trailor_no) as shelter, CONVERT(latitude, DECIMAL(10,6)) as latitude, CONVERT(longitude, DECIMAL(10,6)) as longitude from live_track_idle where trailor_no not in(select a.trailer_no from live_track a,user_assign_trip b where a.created_date_time in(select max(created_date_time) from live_track group by trailer_no) and b.trip_status = 'TRIP_IN_PROGRESS' and a.trip_no=b.user_trip_id AND TIMESTAMPDIFF(MINUTE,(a.created_date_time),SYSDATE())<30 group by a.trailer_no)");
  };

  async getPlaces (){
    return  await this.db.query("select loc_id as id, loc_name as shelter, loc_long as longitude, loc_lati as latitude from location");      
  };
  
}

module.exports = HomeService;