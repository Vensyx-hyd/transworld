'use strict';
const Router = require('express-promise-router')
const passport = require('passport');
const express = require('express');
require('../middleware/passport')(passport)
var AdminController = require('../controllers/adminController.js');
// const { upload } = require('../util/uploadUtilVendorServiceFile.js');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = new Router();

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const upload = multer({ dest: 'uploads/' });

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'df8kh60xu',  // Your Cloudinary details
    api_key: '261529189275742',
    api_secret: 'OBVYsKSfjhTp0dTdwmYD4djzX-8',
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        // console.log("router js",req)
        return {
            folder: 'TG_APP',
            format: ['jpg', 'jpeg', 'pdf'].includes(file.mimetype.split('/')[1]) ? file.mimetype.split('/')[1] : 'jpg',
            public_id: `${req.body.vendorName || file.originalname}_${Date.now()}`, // Custom filename
        };
    },
})
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'TG_APP', // Cloudinary folder
//         format: async (req, file) => ['jpg', 'jpeg', 'pdf'].includes(file.mimetype.split('/')[1]) ? file.mimetype.split('/')[1] : 'jpg', // Supports pdf, jpg, jpeg
//         public_id: (req, file) => `${req.body.vendorName}_${Date.now()}`, // Custom file name
//     },
// });

const upload = multer({ storage: storage });

class AdminRoutes {
    constructor() {
        this.controller = new AdminController();
    }

    routes() {
        //trips
        router.get('/trips', passport.authenticate('jwt', { session: false }), this.controller.getTrips);
        router.get('/trips/:id', passport.authenticate('jwt', { session: false }), this.controller.getTripsById);
        router.post('/trips', passport.authenticate('jwt', { session: false }), this.controller.createTrips);
        router.put('/trips/:id', passport.authenticate('jwt', { session: false }), this.controller.updateTrips);
        router.delete('/trips/:id', passport.authenticate('jwt', { session: false }), this.controller.deleteTrip);
        //files
        router.get('/files', passport.authenticate('jwt', { session: false }), this.controller.getFiles);
        router.get('/files/:id', passport.authenticate('jwt', { session: false }), this.controller.getFilesById);
        router.put('/files', passport.authenticate('jwt', { session: false }), this.controller.uploadFiles);
        //router.put('/files', this.controller.uploadFiles);

        //vendors
        router.get('/vendors', passport.authenticate('jwt', { session: false }), this.controller.getVendors);
        router.get('/vendors/:id', passport.authenticate('jwt', { session: false }), this.controller.getVendorsById);
        // router.post('/vendors', passport.authenticate('jwt', { session: false }), this.controller.createVendors);
        router.put('/vendors/:id', passport.authenticate('jwt', { session: false }), this.controller.updateVendors);

        router.get('/vendorservice', passport.authenticate('jwt', { session: false }), this.controller.getVendorService);
        router.post('/vendorservice', passport.authenticate('jwt', { session: false }), this.controller.createVendorService);
        router.put('/vendorservice/:id', passport.authenticate('jwt', { session: false }), this.controller.updateVendorService);

        router.post('/vendorsfile', passport.authenticate('jwt', { session: false }), upload.single('file'), AdminController.serviceSaveFile);

        router.get('/master', passport.authenticate('jwt', { session: false }), this.controller.getTypes);
        router.post('/master', passport.authenticate('jwt', { session: false }), this.controller.createTypes);

        //roaster
        router.get('/roaster', passport.authenticate('jwt', { session: false }), this.controller.getRoaster);
        router.get('/roaster/:id', passport.authenticate('jwt', { session: false }), this.controller.getRoasterById);
        router.get('/roaster/search/:month', passport.authenticate('jwt', { session: false }), this.controller.getRoasterByMonth);
        router.post('/roaster', passport.authenticate('jwt', { session: false }), this.controller.createRoaster);
        router.put('/roaster/:id', passport.authenticate('jwt', { session: false }), this.controller.updateRoaster);

        //trip intel
        router.get('/intel', passport.authenticate('jwt', { session: false }), this.controller.getIntel);
        router.get('/intel/:id', passport.authenticate('jwt', { session: false }), this.controller.getIntelById);
        router.post('/intel', passport.authenticate('jwt', { session: false }), this.controller.createIntel);
        router.put('/intel/:id', passport.authenticate('jwt', { session: false }), this.controller.updateIntel);
        //admin_veh_mob_tag
        router.get('/tags', passport.authenticate('jwt', { session: false }), this.controller.getTags);
        router.get('/tags/:id', passport.authenticate('jwt', { session: false }), this.controller.getTagsById);
        router.post('/tag', passport.authenticate('jwt', { session: false }), this.controller.createTag);
        router.put('/tag/:id', passport.authenticate('jwt', { session: false }), this.controller.updateTag);
        //manage users
        router.get('/usertypes', passport.authenticate('jwt', { session: false }), this.controller.getUserTypes);
        router.get('/masterusers', passport.authenticate('jwt', { session: false }), this.controller.getMasterUsers);
        router.get('/manageusers', passport.authenticate('jwt', { session: false }), this.controller.getUsers);
        router.get('/manageusersactive', passport.authenticate('jwt', { session: false }), this.controller.getUsersActive);
        router.get('/manageusers/:id', passport.authenticate('jwt', { session: false }), this.controller.getUsersById);
        router.post('/manageusers', passport.authenticate('jwt', { session: false }), this.controller.createUser);
        router.put('/manageusers', passport.authenticate('jwt', { session: false }), this.controller.updateUser);

        return router;
    }
}

module.exports = AdminRoutes;