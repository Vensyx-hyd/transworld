var MsgService = require('../services/msgService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class MsgController{
  constructor(){
    this.service = new MsgService();
    //console.log(this.service);
    this.getMsg=this.getMsg.bind(this);
   
    this.createMsg=this.createMsg.bind(this);

    this.sendMsg=this.sendMsg.bind(this);
    this.getMsgForUser=this.getMsgForUser.bind(this);
    this.disableMessage = this.disableMessage.bind(this);
   
  }

  async getMsg (req,res) {
    var msg = await this.service.getMsg(req.params);
    ReS(res, {message:'Successfully fetched msg.',msg:msg},200);
  }
 
  async createMsg (req,res) {
    var sessionKey=req.header('Authorization');
    var msg =  await this.service.createMsg(req.user, req.body, sessionKey);
    ReS(res, {message:'Successfully Created Message Details',msg:msg},201);
  }

  async sendMsg (req,res) {
    var sessionKey=req.header('Authorization');
    var msg =  await this.service.sendMsg(req.user, req.body, sessionKey);
    ReS(res, {message:'Successfully Sent Message to Drivers',msg:msg},200);
  }

  async getMsgForUser(req,res) {
    var msg =  await this.service.getMsgForUser(req.user, req.query);
    ReS(res, {message:'Successfully fetched Messages',msg:msg},200);
  }

  async disableMessage(req,res) {
    var msg = await this.service.disableMessage(req.user,req.body);
    ReS(res, {message:'Disabled message',msg:msg},200);
  }
}

module.exports = MsgController;