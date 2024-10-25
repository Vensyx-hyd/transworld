const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var TrainingController = require('../controllers/trainingController.js')

const router = new Router()

class TrainingRoutes {
    constructor() {
        this.controller = new TrainingController();
    }

    routes() {
        router.get('/', passport.authenticate('jwt', {session:false}), this.controller.getTrainings);
		router.post('/create', passport.authenticate('jwt', {session:false}), this.controller.createTraining);
        router.post('/assign', passport.authenticate('jwt', {session:false}), this.controller.assignTraining);
        router.get('/assigned', passport.authenticate('jwt', {session:false}), this.controller.getAllottedTrainings);
        router.post('/feedback', passport.authenticate('jwt', {session:false}), this.controller.feedback);
        return router;
    }
}

module.exports = TrainingRoutes;