'use strict';
var TripService = require('../services/tripService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class TripController{
  constructor(){
    this.service = new TripService();
    //console.log(this.service);
    this.getTrips=this.getTrips.bind(this);
    this.getScheduledTrips=this.getScheduledTrips.bind(this);
    this.getManagerTrips=this.getManagerTrips.bind(this);
    this.getTripsForUser=this.getTripsForUser.bind(this);
    this.createTrip=this.createTrip.bind(this);
    this.createTripPendency=this.createTripPendency.bind(this);
    this.updateTrip=this.updateTrip.bind(this);
    this.updateTripPendencyLoc = this.updateTripPendencyLoc.bind(this);
    this.updateTripLoc=this.updateTripLoc.bind(this);
    this.getTripsForUserById=this.getTripsForUserById.bind(this);
    this.getLocations=this.getLocations.bind(this);
    this.updateCheckPointStatus=this.updateCheckPointStatus.bind(this);
    this.getInProgressTripLocations=this.getInProgressTripLocations.bind(this);
    this.updateCurrentLocation=this.updateCurrentLocation.bind(this);
  }

  async getTrips (req,res) {
    var trips = await this.service.getTrips();
    return ReS(res, {message:'Successfully fetched trips.',trips:trips},200);
  }

  async getScheduledTrips (req,res) {
    var trips = await this.service.getScheduledTrips();
    return ReS(res, {message:'Successfully Scheduled fetched trips.',trips:trips},200);
  }

  async getManagerTrips (req,res) {
    var trips = await this.service.getManagerTrips(req.query);
    return ReS(res, {message:'Successfully fetched Manager Trips.',trips:trips},200);
  }

  async getTripsForUser (req,res) {
    var trips;
    if(req.query.from && req.query.to) {
      trips =  await this.service.getTripsForUserInDateRange(req.user.system_user_id, req.query);
    } else {
      trips =  await this.service.getTripsForUser(req.user.system_user_id);
    }
    return ReS(res, {message:'Successfully fetched trips.',trips:trips},200);
  }

  async getTripsForUserById (req,res) {
    var trips =  await this.service.getTripsForUserById(req.user.user_id,req.params);
    return ReS(res, {message:'Successfully fetched trips.',trips:trips},200);
  }

  async createTrip (req,res) {
    var sessionKey=req.header('Authorization');
    try{
      var trips =  await this.service.createTrip(req.body,req.user,sessionKey);
      return ReS(res, {message:'Successfully Created Trip Details',trips:trips},201);
    } catch(error) {
      return ReS(res, {error:error.message},400);
    }    
  }

  async createTripPendency (req,res) {
    var sessionKey=req.header('Authorization');
    try{
      var trips =  await this.service.createTripPendency(req.body,req.user,sessionKey);
      return ReS(res, {message:'Successfully Created Trip Details for Pendency',trips:trips},201);
    } catch(error) {
      return ReS(res, {error:error.message},400);
    }    
  }

  async updateTrip (req,res) {
    var trips =  await this.service.updateTrip(req.params.id,req.body);
    return ReS(res, {message:'Updated trip status.',trips:trips},200);
  }

  async updateTripLoc (req,res) {
    var trips =  await this.service.updateTripLoc(req.params.id, req.user.user_id,req.body);
    return ReS(res, {message:'Successfully Updated ',trips:trips},200);
  }

  async updateTripPendencyLoc (req,res) {
    var trips =  await this.service.updateTripPendencyLoc(req.params.id, req.user.user_id,req.body);
    return ReS(res, {message:'Successfully Updated ',trips:trips},200);
  }

  async getLocations(req,res){
    var locations = await this.service.getLocations();
    return ReS(res,{message:'Fetched locations successfully', locations:locations},200);
  }

  async updateCheckPointStatus(req,res){
    var checkPoints = await this.service.updateCheckPointStatus(req.body,req.user);
    return ReS(res,{message:'Checkpoints details updated', checkPoints:checkPoints},200);
  }

  async getInProgressTripLocations(req,res){
    var locations = await this.service.getInProgressTripLocations();
    return ReS(res,{message:'Fetched locations successfully', locations:locations},200);
  }
  
  async updateCurrentLocation(req,res){
    var locDetails = await this.service.updateCurrentLocation(req.user,req.body);
    return ReS(res,{message:'Current location details updated', locDetails:locDetails},200);
  }

}

module.exports = TripController;