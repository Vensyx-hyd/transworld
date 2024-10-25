'use strict';
var TrainingService = require('../services/trainingService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class TrainingController{
  constructor(){
    this.service = new TrainingService();
    //console.log(this.service);
    this.getTrainings=this.getTrainings.bind(this);
    this.createTraining=this.createTraining.bind(this);
    this.assignTraining=this.assignTraining.bind(this);
    this.getAllottedTrainings=this.getAllottedTrainings.bind(this);
    this.feedback=this.feedback.bind(this);
  }

  async getTrainings (req,res) {
    var trainings = await this.service.getTrainings(req.params);
    ReS(res, {message:'Successfully fetched trainings.',trainings:trainings},200);
  }

  async getAllottedTrainings (req,res) {
    var trainings = await this.service.getAllottedTrainings(req.user);
    ReS(res, {message:'Successfully fetched trainings.',trainings:trainings},200);
  }
 
  async createTraining (req,res) {
    var sessionKey=req.header('Authorization');
    var trainings =  await this.service.createTraining(req.body,sessionKey);
    ReS(res, {message:'Successfully Created Training Details',trainings:trainings},201);
  }

  async assignTraining (req,res) {
    var sessionKey=req.header('Authorization');
    var trainings =  await this.service.assignTraining(req.user,req.body,sessionKey);
    ReS(res, {message:'Successfully Assigned Training to Drivers',trainings:trainings},200);
  }

  async feedback(req,res){
    var sessionKey=req.header('Authorization');
    var trainings =  await this.service.feedback(req.user,req.body);
    ReS(res, {message:'Training feedback updated',trainings:trainings},200);
  }
}

module.exports = TrainingController;