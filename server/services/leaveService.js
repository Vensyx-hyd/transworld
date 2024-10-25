var db = require('../db/db.js');
var UserService = require('../services/userService.js');

class LeaveService {
  constructor(){
    this.db=db;
    this.userService=new UserService();
  };

  async getLeavesById (query) {
    const id=query;
    return await this.db.query("SELECT li.leave_info_id as leaveId, li.system_user_id as sUserId, li.name as driverName, li.leave_app_dt as appliedOn, li.leave_approved_dt as approvedOn,li.leav_app_days as noOfDays, date_format(date(li.leave_app_from_dt),'%d/%m/%Y') as fromDate, date_format(date(li.leave_app_end_dt),'%d/%m/%Y') as toDate, li.user_mob_no as userId, li.remaining_leave as remainingLeaves, li.mob_user_key_id as userKeyId, li.status as status, li.approved_by as approvedBy, li.leave_desc as leaveDesc, wu.available_leaves as availableLeaves from leave_info li,web_user wu WHERE wu.user_id=li.user_mob_no and li.leave_info_id = ?", [id]);
  };

  async getLeaves (userId,query){
    //const userId=query;
    const{from,to}=query;
    if(typeof(from) != "undefined" && typeof(to) != "undefined"){                                                            
      var result = await this.db.query("SELECT li.leave_info_id as leaveId, li.system_user_id as sUserId, li.name as driverName, li.leave_app_dt as appliedOn, li.leave_approved_dt as approvedOn,li.leav_app_days as noOfDays, date_format(date(li.leave_app_from_dt),'%d/%m/%Y') as fromDate, date_format(date(li.leave_app_end_dt),'%d/%m/%Y') as toDate, li.user_mob_no as userId, li.remaining_leave as remainingLeaves, li.mob_user_key_id as userKeyId, li.status as status, li.approved_by as approvedBy, li.leave_desc as leaveDesc, wu.available_leaves as availableLeaves from leave_info li,web_user wu WHERE wu.user_id=li.user_mob_no and li.user_mob_no = ? and li.leave_app_dt between str_to_date(?,'%d-%m-%Y') and str_to_date(?,'%d-%m-%Y') ", [userId,from,to]);
      return result;
    }
    return await this.db.query("SELECT li.leave_info_id as leaveId, li.system_user_id as sUserId, li.name as driverName, li.leave_app_dt as appliedOn, li.leave_approved_dt as approvedOn,li.leav_app_days as noOfDays, date_format(date(li.leave_app_from_dt),'%d/%m/%Y') as fromDate, date_format(date(li.leave_app_end_dt),'%d/%m/%Y') as toDate, li.user_mob_no as userId, li.remaining_leave as remainingLeaves, li.mob_user_key_id as userKeyId, li.status as status, li.approved_by as approvedBy, li.leave_desc as leaveDesc, wu.available_leaves as availableLeaves from leave_info li,web_user wu WHERE wu.user_id=li.user_mob_no and li.user_mob_no = ?", [userId]);
  };

  async getLeavesForApproval (){
    var leaves= await this.db.query("SELECT leave_info_id as leaveId, system_user_id as sUserId, name as driverName, leave_app_dt as appliedOn, leave_approved_dt as approvedOn,leav_app_days as noOfDays, date_format(date(leave_app_from_dt),'%d/%m/%Y') as fromDate, date_format(date(leave_app_end_dt),'%d/%m/%Y') as toDate, user_mob_no as userId, remaining_leave as remainingLeaves, mob_user_key_id as userKeyId, status as status, approved_by as approvedBy, leave_desc as leaveDesc FROM leave_info order by leave_app_dt desc");
    return leaves;
  };


  async createLeaves(user,leaveInfo){
    const { fromDate, toDate, daysOnLeave, leaveDescription}=leaveInfo
    /*console.log('Leave dates from:'+fromDate+" to:"+toDate);
    var from = new Date(fromDate);
    from.setDate(from.getDate() - 1);
    var to = new Date(toDate);
    var diffDays = parseInt((to - from) / (1000 * 60 * 60 * 24)); //gives day difference */
    //one_day means 1000*60*60*24
    //one_hour means 1000*60*60
    //one_minute means 1000*60
    //one_second means 1000
    //console.log(diffDays)
    if(user.available_leaves<daysOnLeave){
      throw new Error("Leave availablity is less than the days you applied");
    }
    var remainingLeaves = parseInt(user.available_leaves);
    var sql='INSERT INTO `leave_info` (`system_user_id`,`name`,`leav_app_days`,`leave_app_dt`,`leave_app_from_dt`,`leave_app_end_dt`,`user_mob_no`,`mob_user_key_id`,`leave_desc`,`status`,remaining_leave)  VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    var values=[user.system_user_id,user.name,daysOnLeave, new Date(),fromDate,toDate,user.user_id,user.user_key_id,leaveDescription,'Pending',remainingLeaves];
    var result= await this.db.query(sql,values);
    /*await this.db.query(
      'UPDATE web_user SET available_leaves = available_leaves-?  WHERE user_id = ?',
      [ daysOnLeave, user.user_id])*/
    return `Leave Requests Submitted Successfully`;
  };



  async updateLeaves(inputId,leaveInfo) {
    const id = parseInt(inputId)
    const { fromDate, toDate}=leaveInfo

    await this.db.query(
      'UPDATE leave_info SET leave_app_from_dt = ?, leave_app_end_dt = ?  WHERE leave_info_id = ?',
      [fromDate, toDate, id])
    return `Leave request modified with ID: ${id}`;
  };

  async approveLeaves(leaveInfo,user,sessionKey) {
    //const id = parseInt(inputId)
    const { leaveId, status}=leaveInfo
    let message;
    let queryString;
    var sendMsgTitle='';
    var leaveRequestDetails = await this.getLeavesById(leaveId);
    var leaveRequest;
    if(leaveRequestDetails){
        leaveRequest = leaveRequestDetails[0];
    }
    if(status==='Approved'){
      queryString="UPDATE leave_info SET approved_by=?, leave_approved_dt = sysdate(), status='Approved', remaining_leave=(remaining_leave-leav_app_days)  WHERE leave_info_id = ? and status='Pending'";
      await this.db.query(queryString, [user.user_id, leaveId]);
      message=`Leave request approved with ID: ${leaveId}`;
      sendMsgTitle='Leave Approval';
      if(leaveRequest){
        await this.db.query(
          'UPDATE web_user SET available_leaves = available_leaves-?  WHERE system_user_id = ?',
          [ leaveRequest.noOfDays, leaveRequest.sUserId])
      }
    } else {
      queryString="UPDATE leave_info SET approved_by=?, leave_approved_dt = sysdate(), status='Rejected'  WHERE leave_info_id = ? and  status='Pending'";
      var result = await this.db.query(queryString, [user.user_id, leaveId]);
      console.log(result);
      message=`Leave request ID: ${leaveId} rejected`;
      sendMsgTitle='Leave Rejected';
    }
    // Start Commented by Vamsi 24-05-2019
    // var loginSuccessKeyArray=await this.userService.getLoginSuccessKey(sessionKey);
    // var loginSuccessKey = loginSuccessKeyArray[0].web_login_key;
    // var sql='INSERT INTO `cfs_msg_sent` (`cfs_msg_sent_dri_name`,`cfs_msg_sent_dt`,`web_user_key_id`,`web_login_key`,`cfs_msg_sent_title`,`is_disabled`)  VALUES (?,?,?,?,?,?)';
    // var values=[leaveRequest.driverName, new Date(), user.user_key_id,loginSuccessKey,sendMsgTitle,'N'];
    // var result= await this.db.query(sql,values);
    // end
    return message;
  };

}

module.exports = LeaveService;