const login = require('./login')
const home = require('./home')
const trailer = require('./trailer')
const drivers = require('./driver')
//const photos = require('./photos')

module.exports = (app) => {
  app.use('/authenticate', login)
  app.use('/home', home)
  app.use('/trailers', trailer)
  app.use('/drivers', drivers)
}

class ServerRoutes{
	constructor(app) {
        app.use('/api/authenticate', login)
		app.use('/api/home', home)
		app.use('/api/trailers', trailer)
		app.use('/api/drivers', drivers)
    };
}

module.exports=ServerRoutes;