const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var TripController = require('../controllers/tripController.js')

const router = new Router()

class TripRoutes {
    constructor() {
        this.controller = new TripController();
    }

    routes() {
        router.get('/', passport.authenticate('jwt', {session:false}), this.controller.getTripsForUser);
        router.get('/:id', passport.authenticate('jwt', {session:false}), this.controller.getTripsForUserById);
        router.post('/create', passport.authenticate('jwt', {session:false}), this.controller.createTrip);
        router.post('/create/pendency', passport.authenticate('jwt', {session:false}), this.controller.createTripPendency);
        router.put('/status/:id', passport.authenticate('jwt', {session:false}), this.controller.updateTrip);
        router.put('/loc/:id', passport.authenticate('jwt', {session:false}), this.controller.updateTripLoc);
        router.put('/pendency/loc/:id', passport.authenticate('jwt', {session:false}), this.controller.updateTripPendencyLoc);
        router.get('/list/all', passport.authenticate('jwt', {session:false}), this.controller.getTrips);
        router.get('/scheduled/all', passport.authenticate('jwt', {session:false}), this.controller.getScheduledTrips);
        router.get('/manager/all', passport.authenticate('jwt', {session:false}), this.controller.getManagerTrips);
        router.get('/locations/list', passport.authenticate('jwt', {session:false}), this.controller.getLocations);
        router.post('/checkpoints', passport.authenticate('jwt', {session:false}), this.controller.updateCheckPointStatus);
        router.post('/currentstatus', passport.authenticate('jwt', {session:false}), this.controller.updateCurrentLocation);
        router.get('/livetracking/all', passport.authenticate('jwt', {session:false}), this.controller.getInProgressTripLocations);
        return router;
    }
}

module.exports = TripRoutes;