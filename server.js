'use strict';
const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const Morgan        = require('morgan');
const passport      = require('passport');
const pe            = require('parse-error');
const path          = require('path');
const cron          = require("node-cron");

// Socket IO
// const http = require('http');
// const socketIO = require('socket.io');
// const axios = require('axios');
// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);
// 

require('dotenv').config();

const CONFIG = require('./server/auth/config.js');
const Controller = require('./server/controllers/homeController');
const ServerRoutes = require('./server/routes/server.js');
class CFSApp {
    constructor() {
        this.app = express();     
        this.ENVIRONMENT = process.env.NODE_ENVIRONMENT;
        this.PORT = process.env[this.ENVIRONMENT + '_SERVER_PORT'];
        this.handleError = this.handleError.bind(this);
        //this.schedulerService = new SchedulerService();

        // 
        // this.server = http.createServer(this.app);
        
        // this.server = this.app.listen(this.PORT);
        
        // this.io = socketIO.listen(this.server);

        this.controller = new Controller();
        // 
    };

    // Socket IO
    // socketIOSync() {
    //     let interval;
    //     this.io.on("connection", socket => {
    //         console.log("New client connected");
    //         this.controller.getLocation(socket);
    //         if (interval) {
    //             clearInterval(interval);
    //         }
    //         interval = setInterval(() => this.controller.getLocation(socket), 120000);            
    //         socket.on("disconnect", () => {
    //             console.log("Client disconnected");
    //         });
    //     });
    // }
    // 

    handleError(error) {
        console.log(error)
    }

    assignMiddleWares() {
        //Log Http Requests in console
        this.app.use(Morgan('dev'));
        //Cross Domain origin request handler
        this.app.use(cors());
        //Body parsers * to json parser
        this.app.use(bodyParser.json({limit: '999mb', parameterLimit: 1000000}));
        this.app.use(bodyParser.urlencoded({limit: '999mb', extended: true, parameterLimit: 1000000}));
        this.app.disable('etag');
		this.app.disable('automatic 304s');
        this.app.use(passport.initialize());
        this.app.options('*', cors()); 
    }

    assignRoutes() {
        //Serving static files
        this.app.use('/', express.static('static'));
        new ServerRoutes(this.app);


        //this.app.use('/api/user', new ServerRoutes().User().routes());

        this.app.use(function(req, res, next) {
            var allowedOrigins = ['https://cfsmanager-dev.azurewebsites.net','http://127.0.0.1:8001', 'http://localhost:8001', 'http://127.0.0.1:3000', 'http://localhost:3000'];
            var origin = req.headers.origin;
            if(allowedOrigins.indexOf(origin) > -1){
                res.setHeader('Access-Control-Allow-Origin', origin);
            }
            res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.header('Access-Control-Allow-Credentials', true);
            return next();
        });

        this.app.use(express.static('client/build'));

        this.app.get('*',  (req, res) => {
            res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        })

        if(process.env.NODE_ENV === 'production'||process.env.NODE_ENVIRONMENT === 'PROD'){
            this.app.use(express.static('static/build'));
            this.app.get('*',  (req, res) => {
                res.sendFile(path.resolve(__dirname, 'static', 'build', 'index.html'));
            })
        }

    }

    /*successHandler(req, res){
        res.statusCode = 200;//send the appropriate status code
        res.json({status:"success", message:"Parcel Pending API", data:{}})
    }*/

    errorHandler(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    }

    serverError(err, req, res, next) {
        // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = err;

      // render the error page
      res.status(err.status || 500);
      res.send('error:'+err.message);
    }

    scheduleJobs( ){
        //Pattern is      sec min hrs * * * respectively          
        let schedule = async function() {
            var SchedulerService = require('./server/services/schedulerService.js');
            var schedulerService = new SchedulerService();
            var result =  await schedulerService.sendMorningMessage();
            console.log(result);
        }
        // 0 2 * * * runs at 8:00 AM Daily   
        cron.schedule("30 2 * * *", schedule);        
        // 0 14 * * * runs at 8:00 PM Daily
        cron.schedule("30 14 * * *", schedule);
    }        

    start() {
        this.assignMiddleWares();
        this.assignRoutes();
        this.scheduleJobs();
        //this.app.use(this.successHandler);
        this.app.use(this.errorHandler);
        this.app.use(this.serverError);
        // 
        // this.socketIOSync();
        // 
        this.app.listen(process.env.PORT||process.env.DEV_SERVER_PORT, () => {
            console.info('Server started on ', this.PORT||process.env.DEV_SERVER_PORT);
        }).on('error', this.handleError);
    }
}

new CFSApp()
    .start();