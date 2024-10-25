'use strict';
var  device       = require('express-device');
const HomeRoutes = require('./home')
const TrailerRoutes = require('./trailer')
const DriverRoutes = require('./driver')
const LoginRoutes = require('./login')
const LeaveRoutes = require('./leave')
const TripRoutes = require('./trip')
const MsgRoutes = require('./msg')
const AdminRoutes=require('./admin')
const TrainingRoutes=require('./training')
const FuelRoutes=require('./fuel')
const ReportRoutes=require('./report')


class ServerRoutes {
	constructor(app) {
        app.use(device.capture())
        app.use('/api/authenticate', new LoginRoutes().routes())
        app.use('/api/home', new HomeRoutes().routes())
        app.use('/api/trailers', new TrailerRoutes().routes())
        app.use('/api/drivers', new DriverRoutes().routes())
        app.use('/api/leaves', new LeaveRoutes().routes())
        app.use('/api/trips', new TripRoutes().routes())
        app.use('/api/msg', new MsgRoutes().routes())
        app.use('/api/admin', new AdminRoutes().routes())
        app.use('/api/trainings', new TrainingRoutes().routes())
        app.use('/api/fuel', new FuelRoutes().routes())
        app.use('/api/report', new ReportRoutes().routes())
    };
}

module.exports = ServerRoutes;