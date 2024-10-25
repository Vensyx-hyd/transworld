'use strict';
var db = require('../db/db.js');
//var UserService = require('../services/userService.js');

class ReportService {
  constructor() {
    this.db = db;
    //this.userService= new UserService();
  };

  async getTripsReport() {
    var result = await this.db.query("select admin_trip_id as tripId, admin_trip_start_loc as startLoc, admin_trip_end_loc as endLoc, admin_trip_distance as distance, admin_trip_fuel_req as fuelReq, admin_trip_dri_inc as driInc, admin_trip_cr_dt as created, admin_trip_mod_dt as modified, admin_trip_status as status, admin_id as userId, case when admin_trip_type_id = 1 then 'Empty' when admin_trip_type_id = 2 then 'Loaded' when admin_trip_type_id = 3 then 'Empty Container' end as tripTypeId, container_type as contType, container_wt as contWt from admin_trip");
    return result;
  };

  async getDriversReport() {
    var result = await this.db.query("select `wdm_id` as masterUserId, `wdm_Dname` as driverName,  `wdm_Ecode` as eCode,  `wdm_con_mob_no` as contactNo, `wdm_fname` as fatherName, `wdm_alt_mob_num` as altContactNo, date_format(date(`wdm_dob`),'%d-%m-%Y') as dob, `wdm_Paddress` as permanentAddress,  `wdm_Caddress` as currentAddress,  `wdm_DL_no` as dlNo, date_format(date(`wdm_DL_validity`),'%d-%m-%Y') as dlValidity, date_format(date(`wdm_doj`),'%d-%m-%Y') as doj, `wdm_PAN` as pan, `wdm_Adhaar` as aadhar,  `wdm_Bank_acc_no` as accountDetails, `wdm_PF_no` as pf,  `wdm_ESIC_no` as esicNo,  `wdm_Remarks` as remarks, `wdm_entry_dt` as entryDate, `wdm_Status` as status  from web_driver_master ");
    return result;
  };

  async getTrailersReport() {
    var result = await this.db.query("select `wtm_id` as masterId, `wtm_tr_no` as trailerNo, `wtm_tr_no` as value, `wtm_tr_no` as label, date_format(date(`wtm_tr_pur_dt`),'%d-%m-%Y') as purchaseDate, `wtm_veh_model` as vehicleModel, `wtm_eh_brand` as brand, `wtm_gvv` as gvv, `wtm_pay_load_cap` as payLoadCap, `wtm_veh_width` as width, `wtm_veh_height` as height, `wtm_veh_len` as length, `wtm_no_tyre` as tyres, `wtm_fuel_cap` as fuelCap, `wtm_rc_no` as rcNo, date_format(date(`wtm_rc_validity`),'%d-%m-%Y') as rcValidity, `wtm_ins_no` as insNo, date_format(date(`wtm_ins_validity`),'%d-%m-%Y') as insValidity, date_format(date(`wtm_puc_validity`),'%d-%m-%Y') as pucValidity, `wtm_fitness_cert` as fitnessCert, `wtm_cr_dt` as createdDate, `wtm_status` as status from `web_trailer_master`");
    return result;
  };

  async getTrainingDetails() {
    var result = await this.db.query("select `cfs_trng_det_id` as trainingId,`cfs_trng_det_name` as trainingName, `cfs_trng_det_tr_name` as trainerName, `cfs_trng_det_tr_loc` as trainingLoc, `cfs_trng_det_tr_days` as days, `cfs_trng_det_status` as status, case when `cfs_trng_type_id` = 1 then 'Driver Loading Training' when `cfs_trng_type_id` = 2 then 'App Training' end as trainingType, date_format(date(`created_date`),'%d-%m-%Y') as createdDate, date_format(date(training_date),'%d-%m-%Y') as trainingDate from `cfs_trng_det`");
    return result;
  };

  async getMaintenanceDetails(query) {
    console.log(query.from);
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to) != "undefined") {
      console.log('from', from);
      console.log('to', to)
      result = await this.db.query("select `web_trail_main_id` as mainId, `web_trail_main_trail_no` as trailerNo, `web_trail_main_km_done` as kmsDone, `web_trail_main_due_km` as dueKm, `web_trail_main_last_ser_km` as lastServiceKm, date_format(date(`web_trail_main_due_ser_dt`),'%d/%m/%Y') as dueServiceDate, date_format(date(`web_trail_main_last_ser_dt`),'%d/%m/%Y') as lastServiceDate, `web_trail_main_status` as status from web_trail_main where web_trail_main_due_ser_dt between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')", [from, to]);
    } else {
      result = await this.db.query("select `web_trail_main_id` as mainId, `web_trail_main_trail_no` as trailerNo, `web_trail_main_km_done` as kmsDone, `web_trail_main_due_km` as dueKm, `web_trail_main_last_ser_km` as lastServiceKm, date_format(date(`web_trail_main_due_ser_dt`),'%d/%m/%Y') as dueServiceDate, date_format(date(`web_trail_main_last_ser_dt`),'%d/%m/%Y') as lastServiceDate, `web_trail_main_status` as status from web_trail_main ");
    }
    return result;
  };

  async getPendencyReport(query) {
    console.log(query.from);
    const { from } = query;
    var result;
    if (typeof (from) != "undefined") {
      console.log('from', from);
      // console.log('to',to)
      // result = await this.db.query("select date_format(date(created_date),'%d-%m-%Y') as date,Vessel_Name as vesselName,container_no as containerNo,substr(Si_ty,1,2) as size, substr(Si_ty,3,4) as type,concat(Berthing_Date,' ',Berthing_Date_Time) as berthing_Date,Cycle as cycle,Line as line,datediff(STR_TO_DATE(Berthing_Date,'%d-%b-%Y'),sysdate()) as dwellDaysatPortCFS,date_format(date(sysdate()),'%d-%m-%Y') as plannedDateforMovement from input_file_tt where id in(select input_file_tt_id from input_file_tt_import where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_import where input_file_tt_id2 is not null union select input_file_tt_id from input_file_tt_export where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_export where input_file_tt_id2 is not null)  and STR_TO_DATE(Berthing_Date,'%d-%b-%Y') = str_to_date(?,'%d-%m-%Y')",[from]);
      result = await this.db.query("select date_format(date(created_date),'%d-%m-%Y') as date, Vessel_Name as vesselName,container_no as containerNo,substr(Si_ty,1,2) as size, substr(Si_ty,3,4) as type,concat(Berthing_Date,' ',Berthing_Date_Time) as berthing_Date, Cycle as cycle,Line as line,datediff(STR_TO_DATE(Berthing_Date,'%d-%b-%Y'),sysdate()) as dwellDaysatPortCFS, date_format(date(sysdate()),'%d-%m-%Y') as plannedDateforMovement from input_file_tt where id in(select input_file_tt_id from input_file_tt_import where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_import where input_file_tt_id2 is not null union select input_file_tt_id from input_file_tt_export where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_export where input_file_tt_id2 is not null union select input_file_tt_id from input_file_tt_internal where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_internal where input_file_tt_id2 is not null) and STR_TO_DATE(Berthing_Date,'%d-%b-%Y') = str_to_date(?,'%d-%m-%Y')", [from]);

    } else {
      // result = await this.db.query("select date_format(date(created_date),'%d-%m-%Y') as date,Vessel_Name as vesselName,container_no as containerNo,substr(Si_ty,1,2) as size, substr(Si_ty,3,4) as type,concat(Berthing_Date,' ',Berthing_Date_Time) as berthing_Date,Cycle as cycle,Line as line,datediff(STR_TO_DATE(Berthing_Date,'%d-%b-%Y'),sysdate()) as dwellDaysatPortCFS,date_format(date(sysdate()),'%d-%m-%Y') as plannedDateforMovement from input_file_tt where id in(select input_file_tt_id from input_file_tt_import where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_import where input_file_tt_id2 is not null union select input_file_tt_id from input_file_tt_export where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_export where input_file_tt_id2 is not null)");
      result = await this.db.query("select date_format(date(created_date),'%d-%m-%Y') as date,Vessel_Name as vesselName, container_no as containerNo,substr(Si_ty,1,2) as size, substr(Si_ty,3,4) as type, concat(Berthing_Date,' ',Berthing_Date_Time) as berthing_Date, Cycle as cycle,Line as line,datediff(STR_TO_DATE(Berthing_Date,'%d-%b-%Y'),sysdate()) as dwellDaysatPortCFS, date_format(date(sysdate()),'%d-%m-%Y') as plannedDateforMovement from input_file_tt where id in(select input_file_tt_id from input_file_tt_import where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_import where input_file_tt_id2 is not null union select input_file_tt_id from input_file_tt_export where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_export where input_file_tt_id2 is not null union select input_file_tt_id from input_file_tt_internal where input_file_tt_id is not null union select input_file_tt_id2 from input_file_tt_internal where input_file_tt_id2 is not null)");


    }
    return result;
  };

  async getPendencyData() {
    var result = await this.db.query("select id, Container_No as cont1,Container_no_2 as cont2,Si_Ty as size,Berthing_Date as date,Cycle as cycle,Origin as startLoc,Destination as endLoc,Status as tripType from input_file_tt_import union select id,Container_No as cont1,Container_no_2 as cont2,Si_Ty as size,Berthing_Date as date,Cycle as cycle,Origin as startLoc,Destination as endLoc, Status as tripType from input_file_tt_export union select id,Container_No as cont1,Container_no_2 as cont2,Si_Ty as size,Berthing_Date as date,Cycle as cycle,Origin as startLoc,Destination as endLoc, Status as tripType from input_file_tt_internal");
    return result;
  };

  async getTatReport(query) {
    console.log(query.from);
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined") {
      console.log('from', from);
      console.log('to', to)
      result = await this.db.query("select ? as currentDate,user_trips.user_trip_id as trip_id,user_assign_trip.user_ass_trip_id as tripno,web_driver_master.wdm_Dname as driverName,user_assign_trip.trailor_no as trailerNo,user_trips.cont_no as containerNo1,user_trips.cont_no_2 as containerNo2, user_trips.size as size,(select loc_name from location where loc_id= user_trips.start_loc_id)  as start_loc,(select loc_name from location where loc_id= user_trips.end_loc_id) as end_loc,date_format(user_assign_trip.act_start_time, '%d-%m-%Y %h:%i %p') as startTime,date_format(user_assign_trip.act_end_time,'%d-%m-%Y %h:%i %p') as endTime,null as check_point_1,null as check_point_2,null as check_point_3,timediff(user_assign_trip.act_end_time,user_assign_trip.act_start_time) as duration from user_trips,user_assign_trip,web_driver_master where user_trips.user_trip_id = user_assign_trip.user_trip_id and user_assign_trip.system_user_id = web_driver_master.wdm_Ecode and user_assign_trip.trip_status = 'TRIP_COMPLETED' and date(user_assign_trip.act_end_time) = str_to_date(?,'%d-%m-%Y')", [from, from]);
    } else {
      //  result = await this.db.query("select `web_trip_tat_id` as tatId, `web_trip_tat_chk1_loc` as chk1Loc, `web_trip_tat_chk2_loc` as chk2Loc, `web_trip_tat_chk3_loc` as chk3Loc, `web_trip_tat_chk1_loc_tm` as chk1Time,`web_trip_tat_chk2_loc_tm` as chk2Time, `web_trip_tat_chk3_loc_tm` as chk3Time, `web_trip_tat_st_loc` as startLoc,`web_trip_tat_st_loc_tm` as startTime,`web_trip_tat_end_loc` as endLoc, `web_trip_tat_end_loc_tm` as endLocTime, `user_ass_trip_id` as assignTripId from web_trip_tat wtt where date_format(date(`web_trip_tat_st_loc_tm`),'%Y-%m-%d') = date_format(date(sysdate()),'%Y-%m-%d')"); // By Vamsi 04-06-2019
      result = await this.db.query("select date_format(date(sysdate()),'%d-%m-%Y') as currentDate,user_trips.user_trip_id as trip_id,user_assign_trip.user_ass_trip_id as tripno,web_driver_master.wdm_Dname as driverName,user_assign_trip.trailor_no as trailerNo,user_trips.cont_no as containerNo1,user_trips.cont_no_2 as containerNo2, user_trips.size as size,(select loc_name from location where loc_id= user_trips.start_loc_id)  as start_loc,(select loc_name from location where loc_id= user_trips.end_loc_id) as end_loc,date_format(user_assign_trip.act_start_time, '%d-%m-%Y %h:%i %p') as startTime,date_format(user_assign_trip.act_end_time,'%d-%m-%Y %h:%i %p') as endTime,null as check_point_1,null as check_point_2,null as check_point_3,timediff(user_assign_trip.act_end_time,user_assign_trip.act_start_time) as duration from user_trips,user_assign_trip,web_driver_master where user_trips.user_trip_id = user_assign_trip.user_trip_id and user_assign_trip.system_user_id = web_driver_master.wdm_Ecode and user_assign_trip.trip_status = 'TRIP_COMPLETED' and date(user_assign_trip.act_end_time) = date(sysdate())");
    }
    return result;
  };

  async getDailyTripReport(query) {
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to)) {
      // result = await this.db.query("select ? as currentDate,user_assign_trip.user_ass_trip_id as tripno, case when admin_trip.admin_trip_type_id = 1 THEN 'EMPTY' when admin_trip.admin_trip_type_id = 2 THEN 'LOADED' when admin_trip.admin_trip_type_id = 3 THEN  'EMPTY CONTAINER' end as  tripType,user_assign_trip.trailor_no as trailerNo,web_driver_master.wdm_Dname as driverName,(select loc_name  from location where loc_id= user_trips.start_loc_id) as start_loc,(select loc_name  from location where loc_id= user_trips.end_loc_id) as end_loc,user_trips.cycle as cycle,user_trips.cont_no as containerNo1,user_trips.cont_no_2 as containerNo2, user_trips.size as size, (select admin_trip_fuel_req from admin_trip where admin_trip_id = user_trips.admin_trip_id) as diesel_useage, date_format(user_assign_trip.act_start_time, '%d-%m-%Y %h:%i %p') as startTime,date_format(user_assign_trip.act_end_time,'%d-%m-%Y %h:%i %p') as endTime, timediff(user_assign_trip.act_end_time,user_assign_trip.act_start_time) as TAT from user_trips,user_assign_trip,web_driver_master,admin_trip where user_trips.user_trip_id = user_assign_trip.user_trip_id and  user_assign_trip.system_user_id = web_driver_master.wdm_Ecode and user_assign_trip.trip_status = 'TRIP_COMPLETED' and user_trips.admin_trip_id=admin_trip.admin_trip_id and date(user_assign_trip.act_end_time) = str_to_date(?,'%d-%m-%Y')",[from,from]);
      result = await this.db.query("select ? as date, tripno as tripNo, tripType as tripType, trailer_no as trailerNo, driver_name as driverName, start_loc as startLoc, end_loc as endLoc, case when tripType = 'Empty' and Cycle is null then 'Internal' else cycle end as cycle, container_no1 as cont1, container_no2 as cont2, size as size, diesel_useage as dieselUsage, date_format(start_time,'%d-%m-%Y %h:%i %p') as startTime, date_format(end_time,'%d-%m-%Y %h:%i %p') as endTime, TAT as TAT from actual_trip_details_report where date(currentDate) = str_to_date(?,'%d-%m-%Y')", [from, from]);

    } else {
      // result = await this.db.query("select date_format(date(sysdate()),'%d-%m-%Y') as currentDate,user_assign_trip.user_ass_trip_id as tripno, case when admin_trip.admin_trip_type_id = 1 THEN 'EMPTY' when admin_trip.admin_trip_type_id = 2 THEN 'LOADED' when admin_trip.admin_trip_type_id = 3 THEN  'EMPTY CONTAINER' end as  tripType,user_assign_trip.trailor_no as trailerNo,web_driver_master.wdm_Dname as driverName,(select loc_name  from location where loc_id= user_trips.start_loc_id) as start_loc,(select loc_name  from location where loc_id= user_trips.end_loc_id) as end_loc,user_trips.cycle as cycle,user_trips.cont_no as containerNo1,user_trips.cont_no_2 as containerNo2, user_trips.size as size, (select admin_trip_fuel_req from admin_trip where admin_trip_id = user_trips.admin_trip_id) as diesel_useage, date_format(user_assign_trip.act_start_time, '%d-%m-%Y %h:%i %p') as startTime,date_format(user_assign_trip.act_end_time,'%d-%m-%Y %h:%i %p') as endTime, timediff(user_assign_trip.act_end_time,user_assign_trip.act_start_time) as TAT from user_trips,user_assign_trip,web_driver_master,admin_trip where user_trips.user_trip_id = user_assign_trip.user_trip_id and  user_assign_trip.system_user_id = web_driver_master.wdm_Ecode and user_assign_trip.trip_status = 'TRIP_COMPLETED' and user_trips.admin_trip_id=admin_trip.admin_trip_id and date(user_assign_trip.act_end_time) = date(sysdate())");
      result = await this.db.query("select date_format(date(currentDate), '%d-%m-%Y') as date, tripno as tripNo, tripType as tripType, trailer_no as trailerNo, driver_name as driverName, start_loc as startLoc, end_loc as endLoc, case when tripType = 'Empty' and Cycle is null then 'Internal' else cycle end as cycle, container_no1 as cont1, container_no2 as cont2, size as size, diesel_useage as dieselUsage, date_format(start_time,'%d-%m-%Y %h:%i %p') as startTime, date_format(end_time,'%d-%m-%Y %h:%i %p') as endTime, TAT as TAT from actual_trip_details_report");
    }
    return result;
  }

  async getDieselUtilizationReport(query) {
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to)) {
      // result = await this.db.query("select date_format(date(a.created_date),'%d-%m-%Y') as createdDate,a.trailor_no as trailerNo,(select name from web_user where system_user_id=a.system_user_id) as driverName,case when c.admin_trip_type_id = 1 then 'Empty' when c.admin_trip_type_id = 2 then 'Loaded' when c.admin_trip_type_id = 3 then 'Empty Container' end as tripType,b.cycle as cycle,b.cont_no as containerNo1,b.cont_no_2 as containerNo2,b.size as size,sum(c.admin_trip_distance) as runkm,sum(c.admin_trip_fuel_req) as Diesel_Spent from user_assign_trip a, user_trips b, admin_trip c where a.user_trip_id = b.user_trip_id and c.admin_trip_id=b.admin_trip_id  and date(a.created_date) between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y') group by  a.system_user_id ",[from,to]);
      result = await this.db.query("select date_format(date(a.currentDate), '%d-%m-%Y') as date, a.tripno as tripNo, a.trailer_no as trailerNo, a.driver_name as driverName ,a.tripType as tripType, a.cycle as cycle, a.container_no1 as cont1, a.container_no2 as cont2, a.size as size, a.diesel_useage as dieselUsage, (select admin_trip_distance from admin_trip where admin_trip_id in(select admin_trip_id from user_trips where user_trip_id in (select user_trip_id from user_assign_trip where user_ass_trip_id=a.tripno))) as runkm from actual_trip_details_report a where date(a.currentDate) between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')", [from, to]);
    } else {
      //  result = await this.db.query("select date_format(date(a.created_date),'%d-%m-%Y') as createdDate, a.trailor_no as trailerNo,(select name from web_user where system_user_id=a.system_user_id) as driverName, case when c.admin_trip_type_id = 1 then 'Empty' when c.admin_trip_type_id = 2 then 'Loaded' when c.admin_trip_type_id = 3 then 'Empty Container' end as tripType,b.cycle as cycle,b.cont_no as containerNo1,b.cont_no_2 as containerNo2,b.size as size,sum(c.admin_trip_distance) as runkm,sum(c.admin_trip_fuel_req) as Diesel_Spent from user_assign_trip a, user_trips b,admin_trip c where a.user_trip_id = b.user_trip_id and c.admin_trip_id=b.admin_trip_id  and month(a.act_end_time)=month(CURRENT_DATE()) and  YEAR(a.act_end_time)=YEAR(CURRENT_DATE()) group by a.system_user_id ");
      result = await this.db.query("select date_format(date(a.currentDate), '%d-%m-%Y') as date, a.tripno as tripNo, a.trailer_no as trailerNo, a.driver_name as driverName ,a.tripType as tripType, a.cycle as cycle, a.container_no1 as cont1, a.container_no2 as cont2, a.size as size, a.diesel_useage as dieselUsage, (select admin_trip_distance from admin_trip where admin_trip_id in(select admin_trip_id from user_trips where user_trip_id in (select user_trip_id from user_assign_trip where user_ass_trip_id=a.tripno))) as runkm from actual_trip_details_report a where date(a.currentDate)");
    }
    return result;
  }

  async getDriverAttendanceReport(query) {
    console.log(query.from);
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to)) {
      console.log('from', from);
      console.log('to', to)
      // select date_format(date(`attend_det_dt`),'%d-%m-%Y') as date,(select `name` from web_user where web_user_key_id=attend_details.mob_user_key_id) as name, min(IF(attend_det_type = 'I', attend_det_intime, NULL)) AS  I, max(IF(attend_det_type = 'O', attend_det_intime, NULL)) AS  O from attend_details where date(attend_det_dt) between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y') group by system_user_id  
      result = await this.db.query("select date_format(date(`attend_det_dt`),'%d-%m-%Y') as date,drive_name as name,system_user_id as empId,concat(attend_det_dt,' | ',attend_det_intime)as I, concat(attend_outdate,' | ',attend_det_outtime) as O from attend_details_temp where date(attend_det_dt) between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y') group by attend_det_dt,system_user_id", [from, to]);
    } else {
      // select date_format(date(`attend_det_dt`),'%d-%m-%Y') as date,(select `name` from web_user where web_user_key_id=attend_details.mob_user_key_id) as name, min(IF(attend_det_type = 'I', attend_det_intime, NULL)) AS  I, max(IF(attend_det_type = 'O', attend_det_intime, NULL)) AS  O from attend_details where  date(`attend_det_dt`)=date(sysdate()) group by system_user_id
      result = await this.db.query("select date_format(date(`attend_det_dt`),'%d-%m-%Y') as date, drive_name as name,system_user_id as empId,concat(attend_det_dt,' | ',attend_det_intime)as I, concat(attend_outdate,' | ',attend_det_outtime) as O from attend_details_temp where date(attend_det_dt) = date(sysdate()) group by system_user_id");

    }
    return result;
  };

  async getTrailerPerformanceReport(query) {
    console.log(query.from);
    const { from } = query;
    var result;
    if (typeof (from) != "undefined") {
      result = await this.db.query("select a.month as month,a.trailor_no as trailor_no,f.admin_driver_roaster_dri_shift2 as name,'shift2',a.tcnt as Tot_Trips_Done,b.loaded as TEU_Loaded_Moved,c.empty as TEU_Empty_Moved,d.sum_of_distance as Tot_Distance_Travelled,d.sum_of_fuel as Tot_Diesel_spent,e.run_time as Tot_Running from((select month(act_end_time) as month ,system_user_id ,trailor_no,count(system_user_id) as tcnt,act_end_time from user_assign_trip   group by system_user_id  )a, (select  user_trip_id,count(user_trip_id) as loaded ,system_user_id from user_assign_trip where user_trip_id in(select user_trip_id from user_trips where trip_type_code=2) group by system_user_id) b , (select  user_trip_id,count(user_trip_id) as empty ,system_user_id from user_assign_trip where user_trip_id in(select user_trip_id from user_trips where trip_type_code=3) group by system_user_id) c , (select v.user_trip_id ,v.system_user_id as system_id,v.trailor_no,sum(x.admin_trip_distance) as sum_of_distance,sum(x.admin_trip_fuel_req) as sum_of_fuel from user_assign_trip v,user_trips w,admin_trip x where v.user_trip_id=w.user_trip_id and w.admin_trip_id=x.admin_trip_id group by v.system_user_id) d, (select user_trip_id,act_start_time,act_end_time, system_user_id ,sum(hour(timediff(act_end_time,act_start_time))) as run_time from user_assign_trip group by system_user_id ) e, ( select  distinct admin_driver_roaster_month,admin_driver_roaster_year, admin_driver_roaster_dri_shift2 ,admin_driver_roaster_trailer_no from admin_driver_roaster ,user_assign_trip where  user_assign_trip.trailor_no=admin_driver_roaster.admin_driver_roaster_trailer_no group by admin_driver_roaster_dri_shift2 ) f) where a.system_user_id=b.system_user_id and b.system_user_id=c.system_user_id and c.system_user_id=d.system_id and d.system_id=e.system_user_id and month(a.act_end_time)=month(month(str_to_date(?,'%m-%Y'))) union (select a.month as month,a.trailor_no as trailor_no,f.admin_driver_roaster_dri_shift1 as name,'shift1',a.tcnt as Tot_Trips_Done,b.loaded as TEU_Loaded_Moved,c.empty as TEU_Empty_Moved,d.sum_of_distance as Tot_Distance_Travelled,d.sum_of_fuel as Tot_Diesel_spent,e.run_time as Tot_Running from((select month(act_end_time) as month ,system_user_id ,trailor_no,count(system_user_id) as tcnt,act_end_time from user_assign_trip   group by system_user_id  )a, (select  user_trip_id,count(user_trip_id) as loaded ,system_user_id from user_assign_trip where user_trip_id in(select user_trip_id from user_trips where trip_type_code=2) group by system_user_id) b , (select  user_trip_id,count(user_trip_id) as empty ,system_user_id from user_assign_trip where user_trip_id in(select user_trip_id from user_trips where trip_type_code=3) group by system_user_id) c , (select v.user_trip_id ,v.system_user_id as system_id,v.trailor_no,sum(x.admin_trip_distance) as sum_of_distance,sum(x.admin_trip_fuel_req) as sum_of_fuel from user_assign_trip v,user_trips w,admin_trip x where v.user_trip_id=w.user_trip_id and w.admin_trip_id=x.admin_trip_id group by v.system_user_id) d, (select user_trip_id,act_start_time,act_end_time, system_user_id ,sum(hour(timediff(act_end_time,act_start_time))) as run_time from user_assign_trip group by system_user_id ) e, ( select  distinct admin_driver_roaster_month,admin_driver_roaster_year,  admin_driver_roaster_dri_shift1 ,admin_driver_roaster_trailer_no from admin_driver_roaster ,user_assign_trip where  user_assign_trip.trailor_no=admin_driver_roaster.admin_driver_roaster_trailer_no group by admin_driver_roaster_dri_shift1 ) f) where a.system_user_id=b.system_user_id and b.system_user_id=c.system_user_id and c.system_user_id=d.system_id and d.system_id=e.system_user_id and month(a.act_end_time)=month(str_to_date(?,'%m-%Y'))) ", [from, from]);
    } else {
      result = await this.db.query(" (select a.month as month,a.trailor_no as trailor_no,f.admin_driver_roaster_dri_shift2 as name,'shift2',a.tcnt as Tot_Trips_Done,b.loaded as TEU_Loaded_Moved,c.empty as TEU_Empty_Moved,d.sum_of_distance as Tot_Distance_Travelled,d.sum_of_fuel as Tot_Diesel_spent,e.run_time as Tot_Running from((select month(act_end_time) as month ,system_user_id ,trailor_no,count(system_user_id) as tcnt,act_end_time from user_assign_trip   group by system_user_id  )a,(select  user_trip_id,count(user_trip_id) as loaded ,system_user_id from user_assign_trip where user_trip_id in(select user_trip_id from user_trips where trip_type_code=2) group by system_user_id) b ,(select  user_trip_id,count(user_trip_id) as empty ,system_user_id from user_assign_trip where  user_trip_id in(select user_trip_id from user_trips where trip_type_code=3) group by system_user_id) c ,(select v.user_trip_id ,v.system_user_id as system_id,v.trailor_no,sum(x.admin_trip_distance) as sum_of_distance,sum(x.admin_trip_fuel_req) as sum_of_fuel from user_assign_trip v,user_trips w,admin_trip x where  v.user_trip_id=w.user_trip_id and w.admin_trip_id=x.admin_trip_id group by v.system_user_id) d,(select user_trip_id,act_start_time,act_end_time, system_user_id ,sum(hour(timediff(act_end_time,act_start_time))) as run_time from user_assign_trip  group by system_user_id ) e,( select  distinct admin_driver_roaster_month,admin_driver_roaster_year, admin_driver_roaster_dri_shift2 ,admin_driver_roaster_trailer_no from admin_driver_roaster ,user_assign_trip where  user_assign_trip.trailor_no=admin_driver_roaster.admin_driver_roaster_trailer_no group by admin_driver_roaster_dri_shift2 ) f) where a.system_user_id=b.system_user_id and b.system_user_id=c.system_user_id and c.system_user_id=d.system_id and d.system_id=e.system_user_id and  month(a.act_end_time)=month(CURRENT_DATE()) and  YEAR(a.act_end_time)=YEAR(CURRENT_DATE())) union (select a.month as month,a.trailor_no as trailor_no,f.admin_driver_roaster_dri_shift1 as name,'shift1',a.tcnt as Tot_Trips_Done,b.loaded as TEU_Loaded_Moved,c.empty as TEU_Empty_Moved,d.sum_of_distance as Tot_Distance_Travelled,d.sum_of_fuel as Tot_Diesel_spent,e.run_time as Tot_Running from((select month(act_end_time) as month ,system_user_id ,trailor_no,count(system_user_id) as tcnt,act_end_time from user_assign_trip   group by system_user_id  )a,(select  user_trip_id,count(user_trip_id) as loaded ,system_user_id from user_assign_trip where  user_trip_id in(select user_trip_id from user_trips where trip_type_code=2) group by system_user_id) b ,(select  user_trip_id,count(user_trip_id) as empty ,system_user_id from user_assign_trip where user_trip_id in(select user_trip_id from user_trips where trip_type_code=3) group by system_user_id) c ,(select v.user_trip_id ,v.system_user_id as system_id,v.trailor_no,sum(x.admin_trip_distance) as sum_of_distance,sum(x.admin_trip_fuel_req) as sum_of_fuel from user_assign_trip v,user_trips w,admin_trip x where v.user_trip_id=w.user_trip_id and w.admin_trip_id=x.admin_trip_id group by v.system_user_id) d,(select user_trip_id,act_start_time,act_end_time, system_user_id ,sum(hour(timediff(act_end_time,act_start_time))) as run_time from user_assign_trip group by system_user_id ) e,( select  distinct admin_driver_roaster_month,admin_driver_roaster_year,  admin_driver_roaster_dri_shift1 ,admin_driver_roaster_trailer_no from admin_driver_roaster ,user_assign_trip where  user_assign_trip.trailor_no=admin_driver_roaster.admin_driver_roaster_trailer_no group by admin_driver_roaster_dri_shift1 ) f) where a.system_user_id=b.system_user_id and b.system_user_id=c.system_user_id and c.system_user_id=d.system_id and d.system_id=e.system_user_id and  month(a.act_end_time)=month(CURRENT_DATE()) and  YEAR(a.act_end_time)=YEAR(CURRENT_DATE())) ");
    }
    return result;
  }

  async getAdhocMaintenanceReport(query) {
    console.log(query.from);
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to)) {
      console.log('from', from);
      console.log('to', to)
      result = await this.db.query("select  wu.name as driverName, uat.trailor_no as trailerNo, date_format(date(`crated_dt`),'%d-%m-%Y') as createdDate,(select web_notify_type_code from web_notify_type wnt where wnt.web_notify_type_id=wun.web_notify_type_id) as requestedServiceType from web_user_notify wun, user_assign_trip uat,web_user wu where uat.user_ass_trip_id=wun.user_ass_trip_id and wu.system_user_id=uat.system_user_id and created_date between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')", [from, to]);
    } else {
      result = await this.db.query("select  wu.name as driverName, uat.trailor_no as trailerNo, date_format(date(`crated_dt`),'%d-%m-%Y') as createdDate,(select web_notify_type_code from web_notify_type wnt where wnt.web_notify_type_id=wun.web_notify_type_id) as requestedServiceType from web_user_notify wun, user_assign_trip uat,web_user wu where uat.user_ass_trip_id=wun.user_ass_trip_id and wu.system_user_id=uat.system_user_id ");
    }
    return result;
  }

  async getDriverTrainingReport(query) {
    console.log(query.from);
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to)) {
      console.log('from', from);
      console.log('to', to)
      // result = await this.db.query("select date_format(date(a.assigned_date),'%d-%m-%Y') as date, a.cfs_trng_alot_dvr_name as driverName, b.cfs_trng_det_name as trainingName, b.cfs_trng_det_tr_name as trainerName, c.cfs_trng_type_desc as trainingType, b.cfs_trng_det_tr_loc as location from cfs_trng_alot a, cfs_trng_det b,cfs_trng_type c  where a.web_login_key = b.web_login_key and b.cfs_trng_type_id = c.cfs_trng_type_id and a.assigned_date between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')",[from,to]);
      result = await this.db.query("select date_format(date(a.assigned_date),'%d-%m-%Y') as date, a.cfs_trng_alot_dvr_name as driverName, b.cfs_trng_det_name as trainingName, b.cfs_trng_det_tr_name as trainerName, c.cfs_trng_type_desc as trainingType, b.cfs_trng_det_tr_loc as location from cfs_trng_alot a, cfs_trng_det b,cfs_trng_type c where b.cfs_trng_type_id = c.cfs_trng_type_id and b.cfs_trng_det_id=a.cfs_trng_det_id and a.assigned_date between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')", [from, to]);
    } else {
      //  result = await this.db.query("select date_format(date(a.assigned_date),'%d-%m-%Y') as date, a.cfs_trng_alot_dvr_name as driverName, b.cfs_trng_det_name as trainingName, b.cfs_trng_det_tr_name as trainerName, c.cfs_trng_type_desc as trainingType, b.cfs_trng_det_tr_loc as location from cfs_trng_alot a, cfs_trng_det b,cfs_trng_type c  where a.web_login_key = b.web_login_key and b.cfs_trng_type_id = c.cfs_trng_type_id");
      result = await this.db.query("select date_format(date(a.assigned_date),'%d-%m-%Y') as date, a.cfs_trng_alot_dvr_name as driverName, b.cfs_trng_det_name as trainingName, b.cfs_trng_det_tr_name as trainerName, c.cfs_trng_type_desc as trainingType, b.cfs_trng_det_tr_loc as location from cfs_trng_alot a, cfs_trng_det b,cfs_trng_type c  where b.cfs_trng_type_id = c.cfs_trng_type_id and b.cfs_trng_det_id=a.cfs_trng_det_id");
    }
    return result;
  }

  async getHireTrailerReport(query) {
    console.log(query.from);
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to)) {
      console.log('from', from);
      console.log('to', to)
      result = await this.db.query("select date_format(date(b.created_date),'%d-%m-%Y') as hireDate,b.cycle as trip_type,cfs_hire_trailer_det_no as trailerNo,b.cont_no as container_no,b.cont_no_2 as container_no2,size as size, cfs_hire_trailer_det_rate as rate,case when b.trip_type_code = 1 then 'empty' when b.trip_type_code = 2 then 'loaded' when b.trip_type_code = 3 then 'empty_container' end as loaded_or_empty  from cfs_hire_trailer_det a, user_trips b,user_assign_trip c where b.user_trip_id = c.user_trip_id and a.cfs_hire_trailer_det_no = c.trailor_no  and b.created_date between  str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')", [from, to]);
    } else {
      result = await this.db.query("select date_format(date(b.created_date),'%d-%m-%Y') as hireDate,b.cycle as trip_type,cfs_hire_trailer_det_no as trailerNo,b.cont_no as container_no,b.cont_no_2 as container_no2,size as size, cfs_hire_trailer_det_rate as rate,case when b.trip_type_code = 1 then 'empty' when b.trip_type_code = 2 then 'loaded' when b.trip_type_code = 3 then 'empty_container' end as loaded_or_empty  from cfs_hire_trailer_det a, user_trips b,user_assign_trip c where b.user_trip_id = c.user_trip_id and a.cfs_hire_trailer_det_no = c.trailor_no ");
    }
    return result;
  }


  async getLGRReport(query) {
    console.log(query.from);
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to)) {
      console.log('from', from);
      console.log('to', to)
      // result = await this.db.query("  select a.container_no as containerNo , a.size as size, a.Line as line, a.type as containerType, a.Vessel_Name as vesselName, trailor_no  as trailerNo, a.ETABerth_Date_Time as berthingDate, a.pendency as dwellDays from eep_lep_sorted a, user_assign_trip b,web_user wu where wu.system_user_id=b.system_user_id and sysdate() between  str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y')",[from,to]);
      result = await this.db.query("select a.Berthing_Date as Date,a.container_no as containerNo,substr(a.Si_Ty,1,2) as size,substr(a.Si_Ty,3,4) as containerType,a.Line as line,a.Origin as FromLocation,a.Vessel_Name as vesselName,a.Gate_In_Date as GateinDate,a.Gate_In_Time as GateInTime,a.Destination as ToLocation,a.Status as Status,concat(a.Berthing_Date,' ',a.Berthing_Date_Time) as Berthing_date_time,a.Release_Date_Time as ReleaseDateTime,a.Dwell_Days_at_Port_CFS as dwell_days,a.Free_Days as Freedays,a.LGR_Slab as LGRslab,a.LGR_Imposed as LGRimposed,a.Offloading_Time as OffLoadingTime,a.Remarks as Remarks from input_file_tt a  and Berthing_date_time between  date_format(?,'%d-%m-%Y') and date_format(?,'%d-%m-%Y')", [from, to]);
    } else {
      // result = await this.db.query("select a.container_no as containerNo , a.size as size, a.Line as line, a.type as containerType, a.Vessel_Name as vesselName, trailor_no  as trailerNo, date_format(date(a.ETABerth_Date_Time),'%d-%m-%Y | %h:%i %p') as berthingDate, a.pendency as dwellDays from eep_lep_sorted a, user_assign_trip b,web_user wu where wu.system_user_id=b.system_user_id");
      result = await this.db.query("select a.Berthing_Date as Date,a.container_no as containerNo,substr(a.Si_Ty,1,2) as size,substr(a.Si_Ty,3,4) as containerType,a.Line as line,a.Origin as FromLocation,a.Vessel_Name as vesselName,a.Gate_In_Date as GateinDate,a.Gate_In_Time as GateInTime,a.Destination as ToLocation,a.Status as Status,concat(a.Berthing_Date,' ',a.Berthing_Date_Time) as Berthing_date_time,a.Release_Date_Time as ReleaseDateTime,a.Dwell_Days_at_Port_CFS as dwell_days,a.Free_Days as Freedays,a.LGR_Slab as LGRslab,a.LGR_Imposed as LGRimposed,a.Offloading_Time as OffLoadingTime,a.Remarks as Remarks from input_file_tt a where Berthing_Date  = date_format(sysdate(),'%d-%b-%Y')");

    }
    return result;
  }

  async getDriverRoasterReport(query) {
    console.log(query.from);
    const { from } = query;
    var result;
    if (typeof (from) != "undefined") {
      console.log('from', from);
      // result = await this.db.query("select ? as date,a.trailerNo as trailerNo ,a.shift1 as shift1 ,a.shift2 as shift2 from (select date_format(?,'%d-%m-%Y') as date,admin_driver_roaster_trailer_no as trailerNo,admin_driver_roaster_dri_shift1 as shift1,admin_driver_roaster_dri_shift2 as shift2 from admin_driver_roaster where  str_to_date(?,'%d-%m-%Y') between date(admin_driver_roaster_st_dt) and date(admin_driver_roaster_end_dt) and admin_driver_roaster_leave_day != dayname(str_to_date(?,'%d-%m-%Y')) union all select date_format(?,'%d-%m-%Y') as date,admin_driver_roaster_trailer_no as trailerNo,admin_driver_roast_shift1_leave as shift1,admin_driver_roaster_shift2_leave as shift2 from admin_driver_roaster where str_to_date(?,'%d-%m-%Y') between date(admin_driver_roaster_st_dt) and date(admin_driver_roaster_end_dt) and admin_driver_roaster_leave_day = dayname(str_to_date(?,'%d-%m-Y'))) a",[from,from,from,from,from,from,from]);
      result = await this.db.query("select ? as date,a.trailerNo as trailerNo ,a.shift1 as shift1 ,a.shift2 as shift2 from (select date_format(?,'%d-%m-%Y') as date,admin_driver_roaster_trailer_no as trailerNo,admin_driver_roaster_dri_shift1 as shift1,admin_driver_roaster_dri_shift2 as shift2 from admin_driver_roaster where  admin_driver_roaster_status='A' and str_to_date(?,'%d-%m-%Y') between date(admin_driver_roaster_st_dt) and date(admin_driver_roaster_end_dt) and admin_driver_roaster_leave_day != dayname(str_to_date(?,'%d-%m-%Y')) union all select date_format(?,'%d-%m-%Y') as date,admin_driver_roaster_trailer_no as trailerNo,admin_driver_roast_shift1_leave as shift1,admin_driver_roaster_shift2_leave as shift2  from admin_driver_roaster where  admin_driver_roaster_status='A' and str_to_date(?,'%d-%m-%Y') between date(admin_driver_roaster_st_dt) and date(admin_driver_roaster_end_dt) and admin_driver_roaster_leave_day = dayname(str_to_date(?,'%d-%m-%Y')) ) a", [from, from, from, from, from, from, from]);
    } else {
      // var result = await this.db.query("select date_format(date(admin_driver_roaster_cr_dt),'%d-%m-%Y') as date, admin_driver_roaster_trailer_no as trailerNo, admin_driver_roaster_dri_shift1 as shift1, admin_driver_roaster_dri_shift2 as shift2 from admin_driver_roaster");
      var result = await this.db.query("select a.date as date,a.trailerNo as trailerNo ,a.shift1 as shift1 ,a.shift2 as shift2 from (select date_format(sysdate(),'%Y-%m-%d') as date,admin_driver_roaster_trailer_no as trailerNo,admin_driver_roaster_dri_shift1 as shift1,admin_driver_roaster_dri_shift2 as shift2 from admin_driver_roaster where admin_driver_roaster_status='A' and  date(current_date) between date(admin_driver_roaster_st_dt) and date(admin_driver_roaster_end_dt) and admin_driver_roaster_leave_day != dayname(current_date()) union all select date(sysdate()) as date,admin_driver_roaster_trailer_no as trailerNo,admin_driver_roast_shift1_leave as shift1,admin_driver_roaster_shift2_leave as shift2 from admin_driver_roaster where admin_driver_roaster_status='A' and date(current_date) between date(admin_driver_roaster_st_dt) and date(admin_driver_roaster_end_dt) and admin_driver_roaster_leave_day = dayname(current_date())) a")
    }
    return result;
  }
}

module.exports = ReportService;