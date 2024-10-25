'use strict';
var LeaveService = require('../services/leaveService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class LeaveController{
  constructor(){
    this.service = new LeaveService();
    //console.log(this.service);
    this.getLeaves=this.getLeaves.bind(this);
    this.getLeavesById=this.getLeavesById.bind(this);
    this.getLeavesForApproval=this.getLeavesForApproval.bind(this);
    this.getLeavesHistory=this.getLeavesHistory.bind(this);
    this.createLeaves=this.createLeaves.bind(this);
    this.updateLeaves=this.updateLeaves.bind(this);
    this.approveLeaves=this.approveLeaves.bind(this);
    this.getLeavesForApproval=this.getLeavesForApproval.bind(this);
  }

  async getLeaves (req,res) {
    var leaves = await this.service.getLeaves(req.user.user_id,req.query);
    return ReS(res, {message:'Successfully fetched leaves.',leaves:leaves},200);
  }

  async getLeavesHistory (req,res) {
    var leaves = await this.service.getLeaves(req.params.userId);
    return ReS(res, {message:'Successfully fetched leaves history.',leaves:leaves},200);
  }

  async getLeavesForApproval (req,res) {
    var leaves = await this.service.getLeavesForApproval();
    return ReS(res, {message:'Successfully fetched leaves for approval 1.',leaves:leaves},200);
  }

  async getLeavesById (req,res) {
    var leaves =  await this.service.getLeavesById(req.params.id);
    ReS(res, {message:'Successfully fetched leaves by id.',leaves:leaves[0]},200);
  }

  async createLeaves (req,res) {
    var leaves =  await this.service.createLeaves(req.user,req.body);
    ReS(res, {message:'Successfully created leaves.',leaves:leaves},201);
  }

  async updateLeaves (req,res) {
    var leaves =  await this.service.updateLeaves(req.params.id,req.body);
    ReS(res, {message:'Successfully modified leaves.',leaves:leaves},200);
  }

  async approveLeaves (req,res) {
    var sessionKey=req.header('Authorization');
    var leaves =  await this.service.approveLeaves(req.body,req.user,sessionKey);
    ReS(res, {message:'Successfully updated leave status',leaves:leaves},200);
  }

}

module.exports = LeaveController;


