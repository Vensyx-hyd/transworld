var DriverService = require('../services/driverService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class DriverController{
  constructor(){
    this.service = new DriverService();
    this.getDrivers=this.getDrivers.bind(this);
    this.getDriversByRoaster=this.getDriversByRoaster.bind(this);
    this.getDriversActive=this.getDriversActive.bind(this);
    this.getDriverById=this.getDriverById.bind(this);
    this.getDriversEmpId=this.getDriversEmpId.bind(this);
    this.getDriversSystemUserId = this.getDriversSystemUserId.bind(this);
    this.createDriver=this.createDriver.bind(this);
    this.updateDriver=this.updateDriver.bind(this);
    this.deleteDriver=this.deleteDriver.bind(this);
    this.dieselRequest=this.dieselRequest.bind(this);
    this.getDieselRequest=this.getDieselRequest.bind(this);
    this.getDieselRequestById=this.getDieselRequestById.bind(this);
    this.handOver=this.handOver.bind(this);
    this.handOverDetails=this.handOverDetails.bind(this);
    this.handOverDetailsById=this.handOverDetailsById.bind(this);
    this.attendanceManual=this.attendanceManual.bind(this);
    this.attendanceDetails=this.attendanceDetails.bind(this);
    this.getProfile=this.getProfile.bind(this);
    this.editProfile=this.editProfile.bind(this);
    this.getMaintenanceRequests = this.getMaintenanceRequests.bind(this);
    this.modifyMaintenanceRequest = this.modifyMaintenanceRequest.bind(this);
    this.createMaintenanceRequest = this.createMaintenanceRequest.bind(this);
    this.createNotify = this.createNotify.bind(this);
    this.getUserNotifications = this.getUserNotifications.bind(this);
    this.getApprovalNotifications = this.getApprovalNotifications.bind(this);
    this.approveNotify = this.approveNotify.bind(this);
    this.getLatestAttendanceDetails = this.getLatestAttendanceDetails.bind(this);
    this.getAttendanceDetails = this.getAttendanceDetails.bind(this);
    this.getSeq=this.getSeq.bind(this);
    this.getSeqById=this.getSeqById.bind(this);
    this.createSeq=this.createSeq.bind(this);
    this.updateSeq=this.updateSeq.bind(this);


    this.getExe=this.getExe.bind(this);
    this.getExeById=this.getExeById.bind(this);
    this.createExe=this.createExe.bind(this);
    this.updateExe=this.updateExe.bind(this);

    this.discardDieselRequest=this.discardDieselRequest.bind(this);
    this.getSchMaintenanceRequests=this.getSchMaintenanceRequests.bind(this);
  }

  async getDrivers (req,res) {
    var drivers = await this.service.getDrivers();
    res.send(drivers);
  }

  async getDriversByRoaster (req,res) {
    var drivers = await this.service.getDriversByRoaster();
    res.send(drivers);
  }

  async getDriversActive (req,res) {
    var active = await this.service.getDriversActive();
    res.send(active);
  }

  async getDriverById (req,res) {
    var drivers =  await this.service.getDriverById(req.params);
    res.send(drivers);
  }

  async getDriversEmpId (req,res){
    var drivers =await this.service.getDriversEmpId();
    console.log(drivers);
    res.send(drivers);
  }

  async getDriversSystemUserId (req,res){
    var drivers =await this.service.getDriversSystemUserId(req.params);
    res.send(drivers);
  }

  async createDriver (req,res) {
    const { name, email } = req.body
    var drivers =  await this.service.createDriver(req.body);
    res.send(drivers);
  }

  async updateDriver (req,res) {
    var drivers =  await this.service.updateDriver(req.params.id,req.body);
    res.send(drivers);
  }

  async deleteDriver (req,res) {
    var drivers =  await this.service.deleteDriver(req.params.id);
    return ReS(res, {message:'Deleted the driver.', drivers:drivers}, 200);
  }

  async dieselRequest(req,res){
    var sessionKey=req.header('Authorization');
    var dieselReq = await this.service.dieselRequest(req.user,req.body,sessionKey);
    return ReS(res, {message:'Successfully created request.', requests:dieselReq}, 200);
  }

  async discardDieselRequest(req,res){
    var dieselReq = await this.service.discardDieselRequest(req.body);
    return ReS(res, {message:'Successfully updated request.', requests:dieselReq}, 200);
  }

  async getDieselRequest(req,res){
    var dieselReq = await this.service.getDieselRequests({userId:req.user.user_id});
    return ReS(res, {message:'Successfully fetched requests.', requests:dieselReq}, 200);
  }

  async getDieselRequestById(req,res){
    var dieselReq = await this.service.getDieselRequests({userId:req.user.user_id,id:req.params.id});
    res.send(dieselReq);
  }

  async handOver(req,res){
    var sessionKey=req.header('Authorization');
    var hoDetails = await this.service.handOver(req.body,sessionKey);
    return ReS(res, {message:'Successfully saved details.', hoDetails:hoDetails}, 200);
  }

  async handOverDetails(req,res){
    var id='-1';
    var hoDetails = await this.service.handOverDetails({userId:req.user.user_id});
    return ReS(res, {message:'Successfully fetched details.', hoDetails:hoDetails}, 200);
  }

  async handOverDetailsById(req,res){
    var handOverDetails = await this.service.handOverDetailsById({userId:req.user.user_id,id:req.params.id});
    return ReS(res, {message:'Successfully fetched details.', handOverDetails:handOverDetails}, 200);
  }

  async getAttendanceDetails(req,res){
    var attendDetails = await this.service.getAttendanceDetails(req)
    return ReS(res, {message:'Successfully fetched details.', attendDetails:attendDetails}, 200);
  }

  async getLatestAttendanceDetails(req,res){
    var attendDetails = await this.service.getLatestAttendanceDetails(req)
    return ReS(res, {message:'Successfully fetched latest Attendance details.', attendDetails:attendDetails}, 200);
  }

  async attendanceManual(req,res){
    var attendDetails = await this.service.attendanceManual(req)
    return ReS(res, {message:'Successfully Create Attendance', attendDetails:attendDetails}, 200);
  }

  async attendanceDetails(req,res){
    var attendDetails = await this.service.attendanceDetails(req)
    return ReS(res, {message:'Successfully saved details.', attendDetails:attendDetails}, 200);
  }

  async getProfile(req,res){
    var profileDetails = await this.service.getProfile(req.user)
    return ReS(res, {message:'Successfully fetched details.', profileDetails:profileDetails}, 200);
  }

  async editProfile(req,res){
    var profileDetails = await this.service.editProfile(req.params.id,req.body)
    return ReS(res, {message:'Successfully modified details.', profileDetails:profileDetails}, 200);
  }
  
  async getMaintenanceRequests(req,res){
    var requests = await this.service.getMaintenanceRequests(req.user)
    return ReS(res, {message:'Successfully fetched details.', requests:requests}, 200);
  }

  async getSchMaintenanceRequests(req,res){
    var requests = await this.service.getSchMaintenanceRequests(req.user)
    return ReS(res, {message:'Successfully fetched details.', requests:requests}, 200);
  }

  async modifyMaintenanceRequest(req,res){
    var requests = await this.service.modifyMaintenanceRequest(req.body)
    return ReS(res, {message:'Successfully modified request.', requests:requests}, 200);
  }

  async createMaintenanceRequest(req,res){
    var requests = await this.service.createMaintenanceRequest(req.params.id,req.body)
    return ReS(res, {message:'Successfully created request.', requests:requests}, 200);
  }

  async createNotify(req,res){
    var sessionKey=req.header('Authorization');
    var notifications = await this.service.createNotify(req, sessionKey);
    return ReS(res, {message:'Successfully created notifications.', notifications:notifications}, 200);
  }
  
  async getUserNotifications(req,res){
    var notifications = await this.service.getNotifyForUser(req.user)
    return ReS(res, {message:'Successfully fetched notifications.', notifications:notifications}, 200);
  }

  async getApprovalNotifications(req,res){
    var notifications = await this.service.getNotifyForApproval()
    return ReS(res, {message:'Successfully fetched notifications.', notifications:notifications}, 200);
  }

  async approveNotify(req,res){
    var sessionKey=req.header('Authorization');
    var notifications = await this.service.approveNotify(req,sessionKey)
    return ReS(res, {message:'Successfully fetched notifications.', notifications:notifications}, 200);
  }

  async getSeq (req,res) {
    var seq = await this.service.getSeq();
    return ReS(res, {message:'Successfully fetched details.', details:seq}, 200);
  }

  async getSeqById (req,res) {
    var seq =  await this.service.getSeqById(req.params);
    return ReS(res, {message:'Successfully fetched details.', details:seq}, 200);
  }

  async createSeq (req,res) {
    var seq =  await this.service.createSeq(req.body);
    return ReS(res, {message:'Successfully created details.', details:seq}, 200);
  }

  async updateSeq (req,res) {
    var seq =  await this.service.updateSeq(req.params.id,req.body);
    return ReS(res, {message:'Successfully updated details.', details:seq}, 200);
  }


  
  async getExe (req,res) {
    var exe = await this.service.getExe();
    ReS(res, {message:'Successfully fetched All Exe Check details.',exe:exe},200);
  }

  async getExeById (req,res) {
    var exe =  await this.service.getExeById(req.params);
    ReS(res, {message:'Successfully fetched Exe Check details.',exe:exe},200);
  }

  async createExe (req,res) {
    var exe =  await this.service.createExe(req.body);
    ReS(res, {message:'Successfully Created Exe Check Details',exe:exe},201);

  }

  async updateExe (req,res) {
    var exe =  await this.service.updateExe(req.params.id,req.body);
    ReS(res, {message:'Successfully Updated Exe Check Details',exe:exe},200);
  }

  
}

module.exports = DriverController;


