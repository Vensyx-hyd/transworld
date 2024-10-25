'use strict';
const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var TrailerController = require('../controllers/trailerController.js')
const router = new Router()

class TrailerRoutes {
    constructor() {
        this.controller = new TrailerController();
    }

    routes() {
        router.get('/', passport.authenticate('jwt', {session:false}), this.controller.getTrailers);
        router.post('/sysid/', passport.authenticate('jwt', {session:false}), this.controller.getTrailerById);
        // router.get('/driver/:id', passport.authenticate('jwt', {session: false}), this.controller.getTrailerById);
        //router.get('/:id', passport.authenticate('jwt', {session:false}), this.controller.getMsg);
		router.post('/create', passport.authenticate('jwt', {session:false}), this.controller.createTrailer);
		router.put('/:id', passport.authenticate('jwt', {session:false}), this.controller.modifyTrailer);
        return router;
    }
}

module.exports = TrailerRoutes;
