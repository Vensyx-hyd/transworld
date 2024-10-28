'use strict';
const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var HomeController = require('../controllers/homeController.js')
const router = new Router()

class HomeRoutes {
    constructor() {
        this.controller = new HomeController();
    }

    routes() {
		router.get('/drivers', passport.authenticate('jwt', {session:false}), this.controller.getDrivers);
        router.get('/trailers', passport.authenticate('jwt', {session:false}), this.controller.getTrailers);
        router.get('/trips', passport.authenticate('jwt', {session:false}), this.controller.getTrips)
        router.get('/performance/trailers', passport.authenticate('jwt', {session:false}), this.controller.getTrailerPerformance)
        router.get('/performance/drivers', passport.authenticate('jwt', {session:false}), this.controller.getDriverPerformance)
        router.get('/performance/trips', passport.authenticate('jwt', {session:false}), this.controller.getTripPerformance)
        router.get('/profile', passport.authenticate('jwt', {session:false}), this.controller.getProfile);
        router.put('/profile/:id', passport.authenticate('jwt', {session:false}), this.controller.editProfile);
        
        router.get('/msg', passport.authenticate('jwt', {session:false}), this.controller.getMsg);
        router.get('/msg/:id', passport.authenticate('jwt', {session:false}), this.controller.getMsgById);
        router.delete('/msg/delete/:id', passport.authenticate('jwt', {session:false}), this.controller.messageDelete);
        router.get('/running/location', passport.authenticate('jwt', {session:false}), this.controller.getRunningLocation);
        router.get('/idle/location', passport.authenticate('jwt', {session:false}), this.controller.getIdleLocation);
        router.get('/place', passport.authenticate('jwt', {session:false}), this.controller.getPlaces);

        router.get('/transit/list', passport.authenticate('jwt', {session:false}), this.controller.getTransitList);
        return router;
    }
}

module.exports = HomeRoutes;

