var TrailerService = require('../services/trailerService.js')
const { to, ReE, ReS }  = require('../services/utilService');

class TrailerController {
	constructor(){
    this.service = new TrailerService();
    this.getTrailers=this.getTrailers.bind(this);
    this.getTrailerById=this.getTrailerById.bind(this);
    this.createTrailer=this.createTrailer.bind(this);
    this.modifyTrailer=this.modifyTrailer.bind(this);
  }

  async getTrailers (req,res) {
    var trailers = await this.service.getTrailers(req.params);
    ReS(res, {message:'Successfully fetched trailers.',trailers:trailers},200);
  }

  async getTrailerById (req,res) { 
    var trailers = await this.service.getTrailerById(req.body);  
    return ReS(res, {message:'Successfully fetched trailer for System User ID.',trailers:trailers},200);
  }
 
  async createTrailer (req,res) {
    var sessionKey=req.header('Authorization');
    var trailers =  await this.service.createTrailer(req.body,sessionKey);
    ReS(res, {message:'Successfully Created Trailer Details',trailers:trailers},201);
  }

  async modifyTrailer (req,res) {
    var sessionKey=req.header('Authorization');
    var trailers =  await this.service.modifyTrailer(req.params.id,req.body,sessionKey);
    ReS(res, {message:'Successfully Updated Trailer Details',trailers:trailers},200);
  }
}


module.exports=TrailerController;
