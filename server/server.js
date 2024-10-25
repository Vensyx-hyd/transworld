'use strict';
const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const Morgan        = require('morgan');
const passport      = require('passport');
const pe            = require('parse-error');
const device        = require('express-device');
const multer        = require('multer');
const app           = express();

require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CONFIG = require('./auth/config');

const ServerRoutes = require('./routes/server.js');
class SampleApp {
    constructor() {
        this.app = express();
        this.ENVIRONMENT = process.env.NODE_ENVIRONMENT;
        this.PORT = process.env[this.ENVIRONMENT + '_SERVER_PORT'];
        this.handleError = this.handleError.bind(this);
    };

    handleError(error) {
        console.log(error)
    }


    assignMiddleWares() {
        //Log Http Requests in console
        this.app.use(Morgan('dev'));

        //Cross Domain origin request handler
        this.app.use(cors());
        this.app.use(device.capture());
        //Body parsers * to json parser
        this.app.use(bodyParser.json({limit: '999mb', parameterLimit: 1000000}));
        this.app.use(bodyParser.urlencoded({limit: '999mb', extended: true, parameterLimit: 1000000}));
        this.app.disable('etag');
		this.app.disable('automatic 304s');
        this.app.use(passport.initialize());
        
    }

    assignRoutes() {
        //Serving static files
        this.app.use(device.capture());
        this.app.use('/', express.static('static'));
        new ServerRoutes(this.app);
        //this.app.use('/api/user', new ServerRoutes().User().routes());
    }

    successHandler(req, res){
        res.statusCode = 200;//send the appropriate status code
        res.json({status:"success", message:"Parcel Pending API", data:{}})
    }

    errorHandler(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }

    /*serverError(err, req, res, next) {
        // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'DEV' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.send('error');
    }*/

    start() {
        this.assignMiddleWares();
        this.assignRoutes();
        this.app.use(this.successHandler);
        this.app.use(this.errorHandler);
        //this.app.use(this.serverError);
        this.app.listen(this.PORT, () => {
            console.info('Server started on ', this.PORT);
        }).on('error', this.handleError);
    }
}


new SampleApp()
    .start();
