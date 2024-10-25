'use strict';
const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var ReportController = require('../controllers/reportController.js')

const router = new Router()

class ReportRoutes {
    constructor() {
        this.controller = new ReportController();
    }

    routes() {
    	router.get('/trip', passport.authenticate('jwt', {session:false}), this.controller.getTripsReport)
		router.get('/driver', passport.authenticate('jwt', {session:false}), this.controller.getDriversReport);
		router.get('/maintenance', passport.authenticate('jwt', {session:false}), this.controller.getMaintenanceDetails);
		router.get('/training', passport.authenticate('jwt', {session:false}), this.controller.getTrainingDetails);	
        router.get('/trailer', passport.authenticate('jwt', {session:false}), this.controller.getTrailersReport);
        router.get('/daily/pendency', passport.authenticate('jwt', {session:false}), this.controller.getPendencyReport);		        
        router.get('/pendency/all', passport.authenticate('jwt', {session:false}), this.controller.getPendencyData);		        
        router.get('/daily/tat', passport.authenticate('jwt', {session:false}), this.controller.getTatReport);
        router.get('/daily/trip', passport.authenticate('jwt', {session:false}), this.controller.getDailyTripReport);		
        router.get('/operational/dieselUtilization', passport.authenticate('jwt', {session:false}), this.controller.getDieselUtilizationReport);		
        router.get('/operational/driverAttendance', passport.authenticate('jwt', {session:false}), this.controller.getDriverAttendanceReport);		
        router.get('/operational/trailerPerformance', passport.authenticate('jwt', {session:false}), this.controller.getTrailerPerformanceReport);		
        router.get('/operational/adhocMaintenance', passport.authenticate('jwt', {session:false}), this.controller.getAdhocMaintenanceReport);		
        router.get('/operational/driverTraining', passport.authenticate('jwt', {session:false}), this.controller.getDriverTrainingReport);		
        router.get('/operational/hireTrailer', passport.authenticate('jwt', {session:false}), this.controller.getHireTrailerReport);		
        router.get('/operational/lgr', passport.authenticate('jwt', {session:false}), this.controller.getLGRReport);		
        router.get('/operational/driverRoaster', passport.authenticate('jwt', {session:false}), this.controller.getDriverRoasterReport);		
        return router;
    }
}

module.exports = ReportRoutes;