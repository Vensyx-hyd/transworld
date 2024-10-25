'use strict'
var HomeService = require('../services/homeService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class HomeController {
	constructor(){
		this.service = new HomeService();
		this.getDrivers=this.getDrivers.bind(this);
		this.getTrailers=this.getTrailers.bind(this);
		this.getTrips=this.getTrips.bind(this);
		this.getTrailerPerformance=this.getTrailerPerformance.bind(this);
		this.getDriverPerformance=this.getDriverPerformance.bind(this);
		this.getTripPerformance=this.getTripPerformance.bind(this);
		this.getProfile=this.getProfile.bind(this);
		this.editProfile=this.editProfile.bind(this);
		this.getMsg=this.getMsg.bind(this);
		this.getMsgById=this.getMsgById.bind(this);
		this.messageDelete = this.messageDelete.bind(this);
		this.getRunningLocation=this.getRunningLocation.bind(this);
		this.getIdleLocation=this.getIdleLocation.bind(this);
		this.getPlaces=this.getPlaces.bind(this);
	}

	async getDrivers (req,res) {
		var drivers = await this.service.getDrivers(req.user);
		if(null !== drivers && drivers.length>0) { 
			return ReS(res, {message:'Successfully fetched drivers.',drivers:drivers[0]},200);
		} else {
			return ReE(res, new Error('Error while fetching drivers'), 400);
		}
  }

  async getTrailers (req,res) {
    var trailers = await this.service.getTrailers(req.user);
    if(null !== trailers && trailers.length>0) { 
			return ReS(res, {message:'Successfully fetched trailers.',trailers:trailers[0]},200);
		} else {
			return ReE(res, new Error('Error while fetching trailers'), 400);
		}
	}
	
	async getTrips (req,res) {
    var trips = await this.service.getTrips(req.user);
    if(null !== trips && trips.length>0) { 
			return ReS(res, {message:'Successfully fetched trips.',trips:trips[0]},200);
		} else {
			return ReE(res, new Error('Error while fetching trips'), 400);
		}
	}
	
	async getDriverPerformance(req,res) {
		var drivers = await this.service.getDriverPerformance(req.user);
    if(null !== drivers && drivers.length>0) { 
			return ReS(res, {message:'Successfully fetched drivers performance.',drivers:drivers},200);
		} else {
			return ReE(res, new Error('Error while fetching drivers performance.'), 400);
		}
	}

	async getTrailerPerformance(req,res) {
		var trailers = await this.service.getTrailerPerformance(req.user);
    if(null !== trailers && trailers.length>0) { 
			return ReS(res, {message:'Successfully fetched drivers performance.',trailers:trailers},200);
		} else {
			return ReE(res, new Error('Error while fetching drivers performance.'), 400);
		}
	}

	async getTripPerformance(req,res) {
		var trips = await this.service.getTripPerformance(req.user);
    if(null !== trips && trips.length>0) { 
			return ReS(res, {message:'Successfully fetched trips performance.',trips:trips},200);
		} else {
			return ReE(res, new Error('Error while fetching trips performance.'), 400);
		}
	}

	async getProfile(req,res){
    var profileDetails = await this.service.getProfile(req.user)
    return ReS(res, {message:'Successfully fetched details.', profileDetails:profileDetails}, 200);
  }

  async editProfile(req,res){
    var profileDetails = await this.service.editProfile(req.params.id,req.body)
    return ReS(res, {message:'Successfully Updated Profile Details', profileDetails:profileDetails}, 200);
	}
	
	async getMsg (req,res) {
    var msg = await this.service.getMsg();
    ReS(res, {message:'Successfully fetched All Messages.',msg:msg},200);
  }
 
  async getMsgById (req,res) {
    var msg =  await this.service.getMsgById(req.params);
    ReS(res, {message:'Successfully fetched cfs Driver Message.',msg:msg},200);
	}
	
	async messageDelete (req,res) {
    var msgDelete =  await this.service.messageDelete(req.params.id);
    ReS(res, {message:'Successfully Deleted Message.',msgDelete:msgDelete},200);
	}	
	
	async getRunningLocation (req,res){
		var location = await this.service.getRunningLocation();
		// socket.emit("FromAPI", location);
		ReS(res, {message:'Fetched Running Locations Successfully.',location:location},200);
	}	

	async getIdleLocation (req,res){
		var location = await this.service.getIdleLocation();
		// socket.emit("FromAPI", location);
		ReS(res, {message:'Fetched Idle Locations Successfully.',location:location},200);
	}

	async getPlaces (req,res){
		var place = await this.service.getPlaces();
		ReS(res, {message:'Featched Places Successfully.',place:place},200);
	}

}

module.exports=HomeController;