const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var LeaveController = require('../controllers/leaveController.js')

const router = new Router()

class LeaveRoutes {
    constructor() {
        this.controller = new LeaveController();
    }

    routes() {
    	
        router.get('/:id', passport.authenticate('jwt', {session:false}), this.controller.getLeavesById);
        router.get('/approve/all', passport.authenticate('jwt', {session:false}), this.controller.getLeavesForApproval);
        router.get('/', passport.authenticate('jwt', {session:false}), this.controller.getLeaves);
        router.get('/history/:userId', passport.authenticate('jwt', {session:false}), this.controller.getLeavesHistory);
		router.post('/apply', passport.authenticate('jwt', {session:false}), this.controller.createLeaves);
        router.put('/:id', passport.authenticate('jwt', {session:false}), this.controller.updateLeaves);
        router.post('/approve', passport.authenticate('jwt', {session:false}), this.controller.approveLeaves);
        return router;
            //.post('/login', this.controller.loginUser)
    }
}

module.exports = LeaveRoutes;