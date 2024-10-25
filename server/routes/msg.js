const Router = require('express-promise-router')
const passport      	= require('passport');
require('../middleware/passport')(passport)
var MsgController = require('../controllers/msgController.js')

const router = new Router()

class MsgRoutes {
    constructor() {
        this.controller = new MsgController();
    }

    /*routePass(req, res, next){
        // do your thing
        passport.authenticate('jwt', {session:false})(req, res, next);
        // ^ this returns a middleware that you gotta call here now ^
    }*/

    routes() {
    	
        
        router.get('/', passport.authenticate('jwt', {session:false}), this.controller.getMsg);
        router.get('/:id', passport.authenticate('jwt', {session:false}), this.controller.getMsg);
		router.post('/create', passport.authenticate('jwt', {session:false}), this.controller.createMsg);
		router.post('/send', passport.authenticate('jwt', {session:false}), this.controller.sendMsg);
        router.get('/mob/user', passport.authenticate('jwt', {session:false}), this.controller.getMsgForUser);
        router.post('/disable', passport.authenticate('jwt', {session:false}), this.controller.disableMessage);
        
        return router;
            //.post('/login', this.controller.loginUser)
    }
}

module.exports = MsgRoutes;