var FuelService = require('../services/fuelService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class FuelController {
	constructor(){
    this.service = new FuelService();
    this.getFuelRequests=this.getFuelRequests.bind(this);
    this.createFuelRequest=this.createFuelRequest.bind(this);
    this.getFuelRequestsForApproval=this.getFuelRequestsForApproval.bind(this);
    this.approveFuelRequests=this.approveFuelRequests.bind(this);
    this.getQrCodes=this.getQrCodes.bind(this);
    this.validateQrCode=this.validateQrCode.bind(this);
  }

  async getFuelRequests (req,res) {
    var requests = await this.service.getFuelRequests(req.params);
    ReS(res, {message:'Successfully fetched fuel requests.',requests:requests},200);
  }
 
  async createFuelRequest (req,res) {
    var sessionKey=req.header('Authorization');
    var requests =  await this.service.createFuelRequest(req.body,sessionKey);
    ReS(res, {message:'Successfully Issued Fuel to Trailer',requests:requests},201);
  }

  async modifyFuelRequest (req,res) {
    var sessionKey=req.header('Authorization');
    var requests =  await this.service.modifyFuelRequest(req.user,req.body,sessionKey);
    ReS(res, {message:'Successfully modified trailer.',requests:requests},200);
  }

  async getFuelRequestsForApproval (req,res) {
    var requests = await this.service.getFuelRequestsForApproval();
    ReS(res, {message:'Successfully fetched fuel requests.1.',requests:requests},200);
  }

  async approveFuelRequests (req,res) {
    var sessionKey=req.header('Authorization');
    var requests = await this.service.approveFuelRequests(req,sessionKey);
    ReS(res, {message:'Successfully Approved Fuel Requests',requests:requests},200);
  }

  async getQrCodes(req,res) {
    var sessionKey=req.header('Authorization');
    var codes = await this.service.getQrCodes(req.body,sessionKey);
    ReS(res, {message:'Successfully fetched Qr codes',codes:codes},200);
  }

  async validateQrCode(req,res){
    //var sessionKey=req.header('Authorization');
    var codes = await this.service.validateQrCode(req.user,req.body);
    ReS(res, {message:'Scan request status updated',codes:codes},200);
  }
}


module.exports=FuelController;
