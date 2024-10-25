var ReportService = require('../services/reportService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class ReportController{
  constructor(){
    this.service = new ReportService();
    this.getTripsReport=this.getTripsReport.bind(this);
    this.getDriversReport=this.getDriversReport.bind(this);
    this.getDriverIncentives=this.getDriverIncentives.bind(this);
    this.getTripIncentives=this.getTripIncentives.bind(this);
    this.getTrailersReport=this.getTrailersReport.bind(this);
    this.getTrainingDetails=this.getTrainingDetails.bind(this);
    this.getMaintenanceDetails= this.getMaintenanceDetails.bind(this);
    this.getTatReport=this.getTatReport.bind(this);
    this.getPendencyReport=this.getPendencyReport.bind(this);
    this.getPendencyData=this.getPendencyData.bind(this);
    this.getDailyTripReport = this.getDailyTripReport.bind(this);
    this.getDieselUtilizationReport = this.getDieselUtilizationReport.bind(this);
    this.getDriverAttendanceReport = this.getDriverAttendanceReport.bind(this);
    this.getTrailerPerformanceReport = this.getTrailerPerformanceReport.bind(this);
    this.getAdhocMaintenanceReport = this.getAdhocMaintenanceReport.bind(this);
    this.getDriverTrainingReport = this.getDriverTrainingReport.bind(this);
    this.getHireTrailerReport = this.getHireTrailerReport.bind(this);
    this.getLGRReport = this.getLGRReport.bind(this);
    this.getDriverRoasterReport = this.getDriverRoasterReport.bind(this);
  }

  async getTripsReport (req,res) {
    //console.log(this);
    var trips = await this.service.getTripsReport();
    ReS(res, {message:'Successfully fetched trips.',trips:trips},200);
  }

  async getDriversReport (req,res) {
    var drivers =  await this.service.getDriversReport();
    ReS(res, {message:'Successfully fetched drivers.',drivers:drivers},200);
  }

  async getDriverIncentives (req,res) {
    const { name, email } = req.body
    var drivers =  await this.service.createDriver(req.body);
    res.send(drivers);
  }

  async getTripIncentives (req,res) {
    var drivers =  await this.service.updateDriver(req.params.id,req.body);
    res.send(drivers);
  }

  async getTrailersReport (req,res) {
    var trailers =  await this.service.getTrailersReport();
    ReS(res, {message:'Successfully fetched trailers.',trailers:trailers},200);
  }

  async getMaintenanceDetails(req,res) {
    var details =  await this.service.getMaintenanceDetails(req.query);
    ReS(res, {message:'Successfully fetched miantenance details.',details:details},200);
  }
  
  async getTrainingDetails(req,res) {
    var trainings =  await this.service.getTrainingDetails(); 
    ReS(res, {message:'Successfully fetched trainings.',trainings:trainings},200);
  }  
  
  async getPendencyReport(req,res) {
    var pendency=  await this.service.getPendencyReport(req.query);
    ReS(res, {message:'Successfully fetched pendency.',pendency:pendency},200);
  }

  async getPendencyData(req,res) {
    var pendency=  await this.service.getPendencyData(req.query);
    ReS(res, {message:'Successfully fetched pendency.',pendency:pendency},200);
  }

  async getTatReport(req,res) {
    var tat =  await this.service.getTatReport(req.query);
    ReS(res, {message:'Successfully fetched tat reports.',tat:tat},200);
  }

  async getDailyTripReport(req,res) {
    var dailyTrips =  await this.service.getDailyTripReport(req.query);
    ReS(res, {message:'Successfully fetched trips.',dailyTrips: dailyTrips},200);
  }

  async getDieselUtilizationReport(req,res) {
    var dieselUtil=  await this.service.getDieselUtilizationReport(req.query);
    ReS(res, {message:'Successfully fetched Diesel Utilization.',dieselUtil:dieselUtil},200);
  }

  async getDriverAttendanceReport(req,res) {
    var driAtt =  await this.service.getDriverAttendanceReport(req.query);
    ReS(res, {message:'Successfully fetched Driver Attendance.',driAtt:driAtt},200);
  }

  async getTrailerPerformanceReport(req,res) {
    var traiPer =  await this.service.getTrailerPerformanceReport(req.query);
    ReS(res, {message:'Successfully fetched Trailer Performance.', traiPer: traiPer}, 200);
  }

  async getAdhocMaintenanceReport(req,res) {
    var adhocMain =  await this.service.getAdhocMaintenanceReport(req.query);
    ReS(res, {message:'Successfully fetched Adhoc Maintenance.', adhocMain: adhocMain}, 200);
  }

  async getDriverTrainingReport(req,res) {
    var driTrain =  await this.service.getDriverTrainingReport(req.query);
    ReS(res, {message:'Successfully fetched Driver Trainings.', driTrain: driTrain},200);
  }

  async getHireTrailerReport(req,res) {
    var hireTrailer =  await this.service.getHireTrailerReport(req.query);
    ReS(res, {message:'Successfully fetched Hire Trailer.', hireTrailer: hireTrailer},200);
  }

  async getLGRReport(req,res) {
    var lgr =  await this.service.getLGRReport(req.query);
    ReS(res, {message:'Successfully fetched LGR.', lgr:lgr},200);
  }

  async getDriverRoasterReport(req,res) {
    var roaster =  await this.service.getDriverRoasterReport(req.query);
    ReS(res, {message:'Successfully fetched Driver Roaster.',roaster:roaster},200);
  }
}

module.exports = ReportController;


