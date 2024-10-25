'use strict';
const Router = require('express-promise-router')

var LoginController = require('../controllers/loginController.js')
const router = new Router()
const passport      	= require('passport');
require('../middleware/passport')(passport)

class LoginRoutes {
    constructor() {
        this.controller = new LoginController();
    }

    routes() {
		router.post('/', this.controller.login);
		router.put('/reset', this.controller.resetPassword);
		router.post('/forgot', this.controller.forgotPassword);
        router.post('/create', this.controller.createUser);
        router.get('/otp/:phone', this.controller.sendOTP);
        router.get('/retryotp/:phone', this.controller.retryOTP);
        router.get('/verifyotp/:phone/:otp', this.controller.verifyOTP);
        router.post('/logout',passport.authenticate('jwt', {session:false}), this.controller.logOut);
        return router;
    }
}

module.exports = LoginRoutes;