'use strict';
const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var FuelController = require('../controllers/fuelController.js')
const router = new Router()

class FuelRoutes {
    constructor() {
        this.controller = new FuelController();
    }

    routes() {
    	router.get('/list', passport.authenticate('jwt', {session:false}), this.controller.getFuelRequests);
        //router.get('/:id', passport.authenticate('jwt', {session:false}), this.controller.getMsg);
		router.post('/create', passport.authenticate('jwt', {session:false}), this.controller.createFuelRequest);
        router.put('/:id', passport.authenticate('jwt', {session:false}), this.controller.modifyFuelRequest);
        router.get('/approve', passport.authenticate('jwt', {session:false}), this.controller.getFuelRequestsForApproval);
        router.post('/approve', passport.authenticate('jwt', {session:false}), this.controller.approveFuelRequests);
        router.post('/qrcode', passport.authenticate('jwt', {session:false}), this.controller.validateQrCode);
        router.get('/qrcode/list', passport.authenticate('jwt', {session:false}), this.controller.getQrCodes);
        return router;
    }
}

module.exports = FuelRoutes;
