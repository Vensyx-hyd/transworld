const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var DriverController = require('../controllers/driverController.js')

const router = new Router()

class DriverRoutes {
    constructor() {
        this.controller = new DriverController();
    }

    routePass(req, res, next){
        passport.authenticate('jwt', {session:false})(req, res, next);
    }

    routes() {
        router.get('/list/:id', passport.authenticate('jwt', {session:false}), this.controller.getDriverById)
        router.get('/list/', passport.authenticate('jwt', {session:false}), this.controller.getDrivers);        
        router.get('/roaster/list', passport.authenticate('jwt', {session:false}), this.controller.getDriversByRoaster);        
        router.get('/active/', passport.authenticate('jwt', {session:false}), this.controller.getDriversActive);
        router.get('/empid/list',passport.authenticate('jwt',{session:false}),this.controller.getDriversEmpId);
        router.get('/sysid/list',passport.authenticate('jwt',{session:false}),this.controller.getDriversSystemUserId);
		router.post('/create', passport.authenticate('jwt', {session:false}), this.controller.createDriver);
		//router.put('/:id', passport.authenticate('jwt', {session:false}), this.controller.updateDriver);
        router.delete('/:id', passport.authenticate('jwt', {session:false}), this.controller.deleteDriver);
        router.post('/diesel/', passport.authenticate('jwt', {session:false}), this.controller.dieselRequest);
        router.post('/diesel/discard', passport.authenticate('jwt', {session:false}), this.controller.discardDieselRequest);
        router.get('/diesel/', passport.authenticate('jwt', {session:false}), this.controller.getDieselRequest);
        router.get('/diesel/:id', passport.authenticate('jwt', {session:false}), this.controller.getDieselRequestById);
        router.get('/handover', passport.authenticate('jwt', {session:false}), this.controller.handOverDetails);
        router.get('/handover/:id', passport.authenticate('jwt', {session:false}), this.controller.handOverDetailsById);
        router.post('/handover', passport.authenticate('jwt', {session:false}), this.controller.handOver);
        router.post('/manual/attendance', passport.authenticate('jwt', {session:false}), this.controller.attendanceManual);
        router.post('/attendance', passport.authenticate('jwt', {session:false}), this.controller.attendanceDetails);
        router.get('/attendance', passport.authenticate('jwt', {session:false}), this.controller.getAttendanceDetails);
        router.get('/latest/attendance', passport.authenticate('jwt', {session:false}), this.controller.getLatestAttendanceDetails);
        router.get('/profile', passport.authenticate('jwt', {session:false}), this.controller.getProfile);
        router.put('/profile/:id', passport.authenticate('jwt', {session:false}), this.controller.editProfile);
        router.get('/maintenance', passport.authenticate('jwt', {session:false}), this.controller.getMaintenanceRequests);
        router.get('/scheduled/maintenance', passport.authenticate('jwt', {session:false}), this.controller.getSchMaintenanceRequests);
        router.post('/maintenance/update', passport.authenticate('jwt', {session:false}), this.controller.modifyMaintenanceRequest);
        router.post('/maintenance/create', passport.authenticate('jwt', {session:false}), this.controller.createMaintenanceRequest);
        router.post('/notify/create', passport.authenticate('jwt', {session:false}), this.controller.createNotify);
        router.get('/notify/list', passport.authenticate('jwt', {session:false}), this.controller.getUserNotifications);
        router.post('/notify/approve', passport.authenticate('jwt', {session:false}), this.controller.approveNotify);
        router.get('/notify/approval', passport.authenticate('jwt', {session:false}), this.controller.getApprovalNotifications);

        router.get('/seq', passport.authenticate('jwt', {session:false}), this.controller.getSeq);
        router.get('/seq/:id', passport.authenticate('jwt', {session:false}), this.controller.getSeqById);
        router.post('/seq', passport.authenticate('jwt', {session:false}), this.controller.createSeq);
        router.put('/seq/:id', passport.authenticate('jwt', {session:false}), this.controller.updateSeq);

        router.get('/exe', passport.authenticate('jwt', {session:false}), this.controller.getExe);
        router.get('/exe/:id', passport.authenticate('jwt', {session:false}), this.controller.getExeById);
        router.post('/exe', passport.authenticate('jwt', {session:false}), this.controller.createExe);
        router.put('/exe/:id', passport.authenticate('jwt', {session:false}), this.controller.updateExe);

        return router;
    }
}

module.exports = DriverRoutes;