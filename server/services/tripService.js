'use strict';
var db = require('../db/db.js');
var UserService = require('../services/userService.js');

class TripService {
  constructor() {
    this.db = db;
    this.UserService = new UserService();
  };

  async getTripsForUser(query) {
    const id = query;
    //var result=await this.db.query('select uat.system_user_id,uat.user_trip_id,uat.user_ass_trip_id,ut.start_loc,ut.end_loc,ut.exp_start_time,ut.exp_end_time,ut.cont_no,(select loc_name from location where loc_id=ut.start_loc_id) as src, (select loc_name from location where loc_id=ut.end_loc_id) as dest from user_trips ut , user_assign_trip uat where uat.user_trip_id=ut.user_trip_id and uat.system_user_id=?', [id]);//and ut.exp_start_time=DATE_FORMAT(SYSDATE(), \'%Y-%m-%d\') 
    var result = await this.db.query("select  uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, ut.exp_start_time as startDate, ut.exp_end_time as endDate, ut.cont_no as contNo, uat.trailor_no as trailerNo, ut.admin_trip_id as adminTripId, (select user_id from web_user where user_type_code=50 limit 1) as cfsManagerContact,(select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus,ut.trip_type_code as tripType from user_trips ut , user_assign_trip uat where uat.user_trip_id=ut.user_trip_id and date_format(exp_start_time,'%Y-%m-%d') = date_format(sysdate(),'%Y-%m-%d') and uat.system_user_id=?", [id]);
    //var result= await this.db.query('select ut.admin_trip_id as adminTripId, uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, ut.exp_start_time as startDate, ut.exp_end_time as endDate, ut.cont_no as contNo, uat.trailor_no as trailerNo, ut.admin_trip_id as adminTripId, 9945144883 as cfsManagerContact,(select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus from user_trips ut , user_assign_trip uat where uat.user_trip_id=ut.user_trip_id and ut.user_trip_id=223');
    if (typeof (result) != "undefined" && result.length > 0) {
      for (var i = 0, len = result.length; i < len; i++) {
        var obj = result[i];
        if (obj.tripStatus === "TRIP_SCHEDULED" || obj.tripStatus === "TRIP_IN_PROGRESS") {
          var checkPoints = await this.db.query("select check_point_order,check_point_loc_id,check_point_loc_name,check_point_loc from admin_trip_chk_points where admin_trip_id=? order by check_point_order", [obj.adminTripId]);
          obj.checkPoints = checkPoints;
        }
      }
    }
    return result;
  };

  async getTripsForUserInDateRange(userId, query) {
    const { from, to } = query;
    if (typeof (from) != "undefined" && typeof (to) != "undefined") {
      return await this.db.query("select  uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, ut.exp_start_time as startDate, ut.exp_end_time as endDate, ut.cont_no as contNo, uat.trailor_no as trailerNo, ut.admin_trip_id as adminTripId, (select user_id from web_user where user_type_code=50 limit 1) as cfsManagerContact,(select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus,ut.trip_type_code as tripType from user_trips ut , user_assign_trip uat where uat.user_trip_id=ut.user_trip_id and DATE(uat.act_start_time) between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y') and uat.system_user_id=? and trip_status=? ", [from, to, userId, "TRIP_COMPLETED"]); // Added trip_status by Vamsi 24-05-2019
    }
    return 'Invalid dates provided';
  };

  async getTripsForUserById(userId, query) {
    const { id } = query;
    var result = await this.db.query('select uat.system_user_id,uat.user_trip_id,uat.user_ass_trip_id,ut.start_loc,ut.end_loc,ut.exp_start_time,ut.exp_end_time,ut.cont_no,(select loc_name from location where loc_id=ut.start_loc_id) as src, (select loc_name from location where loc_id=ut.end_loc_id) as dest from user_trips ut , user_assign_trip uat where uat.user_trip_id=ut.user_trip_id and uat.system_user_id=? and ut.user_trip_id=?', [userId, id]);//and ut.exp_start_time=DATE_FORMAT(SYSDATE(), \'%Y-%m-%d\') 
    return result;
  };

  async getTrips() {
    // return await this.db.query("select uat.created_date, uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, ut.exp_start_time as startDate, ut.exp_end_time as endDate, uat.trailor_no as trailerNo,(select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus, aat.admin_trip_type_id as tripType, wu.name as driverName, uat.act_start_time as actStartTime, uat.act_end_time as actEndTime from user_trips ut , user_assign_trip uat, web_user wu,admin_trip aat where uat.user_trip_id=ut.user_trip_id and wu.system_user_id = uat.system_user_id and aat.admin_trip_id=ut.admin_trip_id order by created_date desc");
    return await this.db.query("select uat.created_date, uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, ut.exp_start_time as startDate, ut.exp_end_time as endDate, uat.trailor_no as trailerNo, (select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus, aat.admin_trip_type_id as tripType, wu.name as driverName, uat.act_start_time as actStartTime, uat.act_end_time as actEndTime from user_trips ut , user_assign_trip uat, web_user wu,admin_trip aat where uat.user_trip_id=ut.user_trip_id and wu.system_user_id = uat.system_user_id and aat.admin_trip_id=ut.admin_trip_id and date(ut.exp_start_time)>=date(adddate(ADDTIME(SYSDATE(), '5:30'),-1)) order by created_date desc");
  };

  async getScheduledTrips() {
    // return await this.db.query("select uat.created_date, uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, ut.exp_start_time as startDate, ut.exp_end_time as endDate, uat.trailor_no as trailerNo,(select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus, aat.admin_trip_type_id as tripType, wu.name as driverName, uat.act_start_time as actStartTime, uat.act_end_time as actEndTime from user_trips ut , user_assign_trip uat, web_user wu,admin_trip aat where uat.user_trip_id=ut.user_trip_id and wu.system_user_id = uat.system_user_id and aat.admin_trip_id=ut.admin_trip_id order by created_date desc");
    return await this.db.query("select uat.created_date, uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, ut.exp_start_time as startDate, ut.exp_end_time as endDate, uat.trailor_no as trailerNo, (select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus, aat.admin_trip_type_id as tripType, wu.name as driverName, uat.act_start_time as actStartTime, uat.act_end_time as actEndTime from user_trips ut , user_assign_trip uat, web_user wu,admin_trip aat where uat.user_trip_id=ut.user_trip_id and wu.system_user_id = uat.system_user_id and aat.admin_trip_id=ut.admin_trip_id and date(ut.exp_start_time)>=date(adddate(ADDTIME(SYSDATE(), '5:30'),-1))");
  };

  async getManagerTrips(query) {
    const { from, to } = query;
    var result;
    if (typeof (from) != "undefined" && typeof (to)) {
      result = await this.db.query("select uat.created_date, uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, date_format(date(ut.exp_start_time),'%d-%m-%Y | %h:%i %p') as startDate, date_format(date(ut.exp_end_time),'%d-%m-%Y | %h:%i %p') as endDate, uat.trailor_no as trailerNo,(select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus, case when aat.admin_trip_type_id = 1 then 'Empty' when aat.admin_trip_type_id = 2 then 'Loaded' when aat.admin_trip_type_id = 3 then 'Empty Container' end as tripType, wu.name as driverName, uat.act_start_time as actStartTime, uat.act_end_time as actEndTime from user_trips ut , user_assign_trip uat, web_user wu,admin_trip aat where uat.user_trip_id=ut.user_trip_id and wu.system_user_id = uat.system_user_id and aat.admin_trip_id=ut.admin_trip_id and uat.created_date between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y') and ut.flag is null order by created_date desc", [from, to])
    }
    else {
      result = await this.db.query("select uat.created_date, uat.user_trip_id as tripNo, uat.user_ass_trip_id as assignTripNo, ut.start_loc as startLocationGeoPoints, ut.end_loc as endLocationGeoPoints, date_format(date(ut.exp_start_time),'%d-%m-%Y | %h:%i %p') as startDate, date_format(date(ut.exp_end_time),'%d-%m-%Y | %h:%i %p') as endDate, uat.trailor_no as trailerNo,(select loc_name from location where loc_id=ut.start_loc_id) as startLocationName, (select loc_name from location where loc_id=ut.end_loc_id) as endLocationName, uat.trip_status as tripStatus, case when aat.admin_trip_type_id = 1 then 'Empty' when aat.admin_trip_type_id = 2 then 'Loaded' when aat.admin_trip_type_id = 3 then 'Empty Container' end as tripType, wu.name as driverName, uat.act_start_time as actStartTime, uat.act_end_time as actEndTime from user_trips ut , user_assign_trip uat, web_user wu,admin_trip aat where uat.user_trip_id=ut.user_trip_id and wu.system_user_id = uat.system_user_id and aat.admin_trip_id=ut.admin_trip_id and ut.flag is null order by created_date desc");
    }
    return result;
  };

  async getAdminID(a, b, c, d) {
    var result = await this.db.query("select `admin_trip_id` as adminTripId from admin_trip where admin_trip_start_loc=? and admin_trip_end_loc=? and admin_trip_type_id=? and container_type=? GROUP BY admin_trip_start_loc,admin_trip_end_loc,admin_trip_type_id,container_type", [a, b, c, d]);
    return result;
  }

  async createTrip(input, user, sessionKey) {
    const { tripType, contType, startLoc, startLocName, endLocName, endLoc, startLocId, endLocId, expStartTime, expEndTime, driverId, trailerNo, contNo, createdTypeCode } = input
    var userId = user.user_id;
    var userName = user.name;
    let adminId = await this.getAdminID(startLocName, endLocName, tripType, contType);
    let adminTripValueId = adminId[0].adminTripId;
    var sql = 'INSERT INTO `user_trips` (`start_loc`,`end_loc`,`exp_start_time`,`exp_end_time`,`created_by`,`created_user`,`trip_type_code`,`cont_no`, `created_type_code`,`status`,`start_loc_id`,`end_loc_id`,`last_updated`,`updated_by`,`created_date`,`admin_trip_id`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var values = [startLoc, endLoc, new Date(expStartTime), new Date(expEndTime), userId, userName, tripType, contNo, createdTypeCode, 'a', startLocId, endLocId, new Date(), userId, new Date(), adminTripValueId];
    var result = await this.db.query(sql, values);
    console.log(result)
    if (typeof (result.insertId) != "undefined") {
      var loginSuccessKeyArray = await this.UserService.getLoginSuccessKeyFromSystemUserId(driverId);
      if (typeof (loginSuccessKeyArray) != "undefined" && loginSuccessKeyArray.length > 0) {
        var loginSuccessKey = loginSuccessKeyArray[0].web_login_key;
        var assignSql = 'INSERT INTO `user_assign_trip` (`mob_login_key`, `user_trip_id`,`system_user_id`,`trailor_no`,`trip_status`,`last_updated`,`created_date`)  VALUES (?,?,?,?,?,?,?)';
        var assignValues = [loginSuccessKey, result.insertId, driverId, trailerNo, 'TRIP_SCHEDULED', new Date(), new Date()];
        var assignResult = await this.db.query(assignSql, assignValues);
      } else {
        throw new Error('No Active session found for the user: ' + driverId);
      }
    }
    return `Trip added with ID: ${result.insertId}`;
  };

  async createTripPendency(input, user, sessionKey) {
    const { id, size, cycle, berthingDate, tripType, startLoc, startLocId, startLocLatLong, endLoc, endLocId, endLocLatLong, expStartTime, expEndTime, driverId, trailerNo, cont1, cont2, createdTypeCode } = input
    var userId = user.user_id;
    var userName = user.name;
    let adminId = await this.getAdminID(startLoc, endLoc, tripType, size);
    let adminTripValueId = adminId[0].adminTripId;
    var sql = 'INSERT INTO `user_trips` (`start_loc`,`end_loc`,`exp_start_time`,`exp_end_time`,`created_by`,`created_user`,`trip_type_code`,`cont_no`, `cont_no_2`, `created_type_code`,`status`,`start_loc_id`,`end_loc_id`,`last_updated`,`updated_by`,`created_date`,`admin_trip_id`, `py_seq_sort`, `size`, `cycle`, `berthing_date`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var values = [startLocLatLong, endLocLatLong, new Date(expStartTime), new Date(expEndTime), userId, userName, tripType, cont1, cont2, createdTypeCode, 'a', startLocId, endLocId, new Date(), userId, new Date(), adminTripValueId, id, size, cycle, berthingDate];

    var result = await this.db.query(sql, values);
    var loginSuccessKeyArray = await this.UserService.getLoginSuccessKeyFromSystemUserIdInactive(driverId);
    var loginSuccessKey = loginSuccessKeyArray[0].web_login_key;
    var assignSql = 'INSERT INTO `user_assign_trip` (`mob_login_key`, `user_trip_id`,`system_user_id`,`trailor_no`,`trip_status`,`last_updated`,`created_date`)  VALUES (?,?,?,?,?,?,?)';
    var assignValues = [loginSuccessKey, result.insertId, driverId, trailerNo, 'TRIP_COMPLETED', new Date(), new Date()];
    var assignResult = await this.db.query(assignSql, assignValues);

    if (cycle == 'IMPORT') {
      await this.db.query("INSERT INTO input_file_tt_import_backup (select * from input_file_tt_import where cycle = 'IMPORT' and id = ?)", [id]);
      await this.db.query("DELETE FROM input_file_tt_import where cycle = 'IMPORT' and id = ?", [id]);
    } else if (cycle == 'EXPORT') {
      await this.db.query("INSERT INTO input_file_tt_export_backup (select * from input_file_tt_export where  cycle = 'EXPORT' and id = ?)", [id]);
      await this.db.query("DELETE FROM input_file_tt_export where cycle = 'EXPORT' and id = ?", [id]);
    } else if ((cycle == 'TP') || (cycle == 'INTERNAL TRANSFER')) {
      await this.db.query("INSERT INTO input_file_tt_internal_backup (select * from input_file_tt_internal where (cycle = 'TP' or cycle = 'INTERNAL TRANSFER') and id = ?)", [id]);
      await this.db.query("DELETE FROM input_file_tt_internal where (cycle = 'TP' or cycle = 'INTERNAL TRANSFER') and id = ?", [id]);
    }

    return `Trip added with ID: ${result.insertId}`;
  };

  async updateTripLoc(inputId, userId, input) {
    const id = parseInt(inputId)
    const { driver, startLocId, endLocId } = input;
    console.log(startLocId, "Start Location ID");
    if (startLocId != undefined) {
      this.db.query(
        "UPDATE user_trips SET updated_by=?, start_loc_id=?, start_loc = (select concat(loc_lati,concat(',',loc_long)) from location where loc_id=?), last_updated=now() WHERE user_trip_id = ?",
        [userId, startLocId, startLocId, id])
    }
    await this.db.query(
      "UPDATE user_trips SET updated_by=?, end_loc_id=?, end_loc = (select concat(loc_lati,concat(',',loc_long)) from location where loc_id=?), last_updated=now() WHERE user_trip_id = ?",
      [userId, endLocId, endLocId, id])
    await this.db.query(
      // 'UPDATE user_assign_trip SET system_user_id=?, last_updated=now() WHERE user_trip_id = ?',
      'UPDATE user_assign_trip SET system_user_id=? WHERE user_trip_id = ?',
      [driver, id])
    return `with Trip ID: ${id}`;
  }

  async updateTripPendencyLoc(inputId, userId, input) {
    const id = parseInt(inputId);
    const { driver, trailerNumber } = input;
    await this.db.query(
      'UPDATE user_assign_trip SET system_user_id=?, trailor_no = ?, trip_status = "TRIP_COMPLETED", last_updated=now() WHERE user_trip_id = ?',
      [driver, trailerNumber, id])
    return `with Trip ID: ${id}`;
  }

  async updateTrip(inputId, input) {
    const id = parseInt(inputId)
    const { status } = input;
    var queryString = '';
    if (status === 'TRIP_IN_PROGRESS') {
      queryString = 'UPDATE user_assign_trip SET trip_status=?, act_start_time = now(), last_updated=now() WHERE user_trip_id = ?';
    } else if (status === 'TRIP_COMPLETED' || status === 'TRIP_CANCELLED') {
      queryString = 'UPDATE user_assign_trip SET trip_status=?, act_end_time = now(), last_updated=now() WHERE user_trip_id = ?';
    } else {
      queryString = 'UPDATE user_assign_trip SET trip_status=?, last_updated=now() WHERE user_trip_id = ?';
    }
    await this.db.query(
      queryString,
      [status, id])
    return `with ID: ${id}`;
  };

  async getLocations() {
    var result = await this.db.query("select loc_id as locId, loc_name as locName, loc_name as label, concat(loc_lati,concat(',',loc_long)) as latLong from location");
    return result;
  }

  async updateCheckPointStatus(checkPointInfo) {
    const { tripId, cpOrder, cpLocId, cpLoc, cpName } = checkPointInfo;
    //var result = await this.db.query("select chk_pnt1 as checkPoint1,chk_pnt1_lat_lon as checkPointLoc1,chk_pnt2 as checkPoint2,chk_pnt2_lat_lon as checkPointLoc2,chk_pnt3 as checkPoint3,chk_pnt3_lat_lon as checkPointLoc3 from  trip_loc_map_chk_points where admin_trip_id=?",[id]);
    var sql = 'INSERT INTO `user_trips_chk_points_track` (`user_trip_id`, `check_point_order`,`check_point_loc_id`,`check_point_loc_name`,`check_point_loc`,`crossed_at`)  VALUES (?,?,?,?,?,?)';
    var values = [tripId, cpOrder, cpLocId, cpName, cpLoc, new Date()];
    var result = await this.db.query(sql, values);
    return `CheckPoint details added with ID: ${result.insertId}`;
  }

  async getInProgressTripLocations() {
    var result = await this.db.query("select t.trip_no,t.created_date_time,t.trailer_no,t.driver_id,t.driver_name,t.loc_coordinate_lat_long,ut.startLocationName,ut.endLocationName,ut.start_loc_id,ut.end_loc_id from live_track t inner join (SELECT trip_no,MAX(created_date_time) as max_date FROM live_track where trip_no in (select uat.user_trip_id from user_assign_trip uat where trip_status= 'TRIP_IN_PROGRESS') GROUP BY trip_no) a on a.trip_no = t.trip_no and a.max_date = t.created_date_time inner join ( select user_trip_id,(select loc_name from location where loc_id=start_loc_id) as startLocationName, (select loc_name from location where loc_id=end_loc_id) as endLocationName,start_loc_id,end_loc_id from user_trips) ut on ut.user_trip_id=t.trip_no");
    return result;
  }

  async updateCurrentLocation(userInfo, checkPointInfo) {
    var driverName = userInfo.name;
    var driverId = userInfo.user_id;
    const { tripId, trailerNo, loc } = checkPointInfo;
    var sql = 'INSERT INTO `live_track` (`trip_no`,`driver_name`,`trailer_no`,`loc_coordinate_lat_long`,`created_date_time`,`driver_id`)  VALUES (?,?,?,?,?,?)';
    var values = [tripId, driverName, trailerNo, loc, new Date(), driverId];
    var result = await this.db.query(sql, values);
    return `CheckPoint details added with ID: ${result.insertId}`;
  }

}

module.exports = TripService;