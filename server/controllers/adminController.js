'use strict';
const formidable = require('formidable');
var AdminService = require('../services/adminService.js');
const { to, ReE, ReS } = require('../services/utilService');

class AdminController {
  constructor() {
    this.service = new AdminService();

    this.getTrips = this.getTrips.bind(this);
    this.getTripsById = this.getTripsById.bind(this);
    this.createTrips = this.createTrips.bind(this);
    this.updateTrips = this.updateTrips.bind(this);
    this.deleteTrip = this.deleteTrip.bind(this);

    this.getFiles = this.getFiles.bind(this);
    this.getFilesById = this.getFilesById.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);

    this.getVendors = this.getVendors.bind(this);
    this.getVendorsById = this.getVendorsById.bind(this);
    // this.createVendors = this.createVendors.bind(this);
    this.updateVendors = this.updateVendors.bind(this);

    // this.serviceSaveFile = this.serviceSaveFile.bind(this);

    this.getVendorService = this.getVendorService.bind(this);
    this.createVendorService = this.createVendorService.bind(this);
    this.updateVendorService = this.updateVendorService.bind(this);
    this.createTypes = this.createTypes.bind(this);
    this.getTypes = this.getTypes.bind(this);

    this.getRoaster = this.getRoaster.bind(this);
    this.getRoasterById = this.getRoasterById.bind(this);
    this.createRoaster = this.createRoaster.bind(this);
    this.updateRoaster = this.updateRoaster.bind(this);
    this.getRoasterByMonth = this.getRoasterByMonth.bind(this);

    this.getIntel = this.getIntel.bind(this);
    this.getIntelById = this.getIntelById.bind(this);
    this.createIntel = this.createIntel.bind(this);
    this.updateIntel = this.updateIntel.bind(this);

    this.getTags = this.getTags.bind(this);
    this.getTagsById = this.getTagsById.bind(this);
    this.createTag = this.createTag.bind(this);
    this.updateTag = this.updateTag.bind(this);

    this.getUserTypes = this.getUserTypes.bind(this);
    this.getMasterUsers = this.getMasterUsers.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getUsersActive = this.getUsersActive.bind(this);
    this.getUsersById = this.getUsersById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async getTrips(req, res) {
    var trips = await this.service.getTrips(req.params);
    ReS(res, { message: 'Successfully fetched trips.', trips: trips }, 200);
  }

  async getTripsById(req, res) {
    var trips = await this.service.getTripsById(req.params);
    ReS(res, { message: 'Successfully fetched trips.', trips: trips }, 200);
  }

  async createTrips(req, res) {
    var trips = await this.service.createTrips(req.user.user_key_id, req.body);
    ReS(res, { message: 'Successfully Created Trip Details', trips: trips }, 201);
  }

  async updateTrips(req, res) {
    var trips = await this.service.updateTrips(req.params.id, req.body);
    ReS(res, { message: 'Successfully Updated Trip Details', trips: trips }, 200);
  }

  async deleteTrip(req, res) {
    var trips = await this.service.deleteTrip(req.params.id);
    ReS(res, { message: 'Successfully Deleted Trip Details', trips: trips }, 200);
  }

  async getFiles(req, res) {
    var files = await this.service.getFiles(req.params);
    ReS(res, { message: 'Successfully fetched files.', files: files }, 200);
  }

  async getFilesById(req, res) {
    var files = await this.service.getFilesById(req.params);
    ReS(res, { message: 'Successfully fetched files.', files: files }, 200);
  }

  async uploadFiles(req, res) {
    //let files;
    await new formidable.IncomingForm().parse(req)
      .on('file', (name, file) => {
        this.service.uploadFiles(file);
        ReS(res, { message: 'Successfully Uploaded File' }, 200);
        // if(file.type === 'text/csv') {
        //   this.service.uploadFiles(file);
        //   ReS(res, {message:'Successfully Uploaded File'},200);
        // } else {
        //   ReE(res, {message:"File Type:" +file.type+" is invalid "},400);
        // }
      })
      .on('aborted', () => {
        console.error('Request aborted by the user')
      })
      .on('error', (err) => {
        console.error('Error', err)
        throw err
      })
      .on('end', (name, file) => {

      })
    //console.log('uploadedFiles', uploadedFiles)
    //var files =  await this.service.uploadFiles(file);
  }

  async getVendors(req, res) {
    var vendors = await this.service.getVendors(req.params);
    ReS(res, { message: 'Successfully fetched vendors.', vendors: vendors }, 200);
  }

  async getVendorsById(req, res) {
    var vendors = await this.service.getVendorsById(req.params);
    ReS(res, { message: 'Successfully fetched vendors.', vendors: vendors }, 200);
  }

  // async createVendors(req, res) {
  //   var vendors = await this.service.createVendors(req.body);
  //   ReS(res, { message: 'Successfully Created Vendor Details', vendors: vendors }, 200);
  // }

  async updateVendors(req, res) {
    var vendors = await this.service.updateVendors(req.body);
    ReS(res, { message: 'Successfully Updated Vendor Details', vendors: vendors }, 200);
  }

  // Method to handle the file upload and Cloudinary logic
  static async serviceSaveFile(req, res) {
    try {
      // Log the body and file details
      // console.log("Body Data:", req.body);
      // console.log("Body Data1:", req.body.vendorName);
      // console.log("File Data:", req.file);

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Multer with Cloudinary automatically handles file uploads, so the file URL will be available in req.file.path
      const cloudinaryUrl = req.file.path;

      const formData = {
        vendorname: req.body.vendorName,
        location: req.body.location,
        contactperson: req.body.contactperson,
        designation: req.body.designation,
        contactnumber: req.body.contactnumber,
        contactemail: req.body.contactemail,
        kycTypeId: req.body.kycTypeId,
        kycNumber: req.body.kycNumber,
        vendortype: req.body.vendortype,
        adminUser: req.body.adminUser,
        contactperson2: req.body.contactperson2, // For business type
        designation2: req.body.designation2,
        contactnumber2: req.body.contactnumber2,
        contactemail2: req.body.contactemail2,
        fileUrl: cloudinaryUrl, // Add the cloudinaryUrl to the formData
      };

      const vendorResponse = await AdminService.createVendors(formData);

      return res.status(200).json({
        message: 'Vendor created successfully',
        data: vendorResponse,
      });

      // // Send success response with the Cloudinary URL and vendor name
      // return res.status(200).json({
      //   message: 'File uploaded successfully',
      //   data: {
      //     cloudinaryUrl: cloudinaryUrl,
      //     vendorName: req.body.vendorName,
      //   },
      // });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ message: 'Error uploading file', error });
    }
  }

  async getVendorService(req, res) {
    var service = await this.service.getVendorService(req.params);
    ReS(res, { message: 'Successfully Fetched Vendor Service Details', service: service }, 200);
  }

  async createVendorService(req, res) {
    var vendorservice = await this.service.createVendorService(req.body);
    ReS(res, { message: 'Successfully Created Vendor Service Details', vendorservice: vendorservice }, 200);
  }

  async updateVendorService(req, res) {
    var vendorservice = await this.service.updateVendorService(req.body);
    ReS(res, { message: 'Successfully Update Vendor Service Details', vendorservice: vendorservice }, 200);
  }

  async createTypes(req, res) {
    var types = await this.service.createTypes(req.body);
    ReS(res, { message: 'Successfully Created Types Details', types: types }, 200);
  }

  async getTypes(req, res) {
    var getTypes = await this.service.getTypes(req.params);
    ReS(res, { message: 'Successfully Fetched Types Details', getTypes: getTypes }, 200);
  }


  async getRoaster(req, res) {
    var roaster = await this.service.getRoaster(req.params);
    ReS(res, { message: 'Successfully fetched roaster.', roaster: roaster }, 200);
  }

  async getRoasterById(req, res) {
    var roaster = await this.service.getRoasterById(req.params);
    ReS(res, { message: 'Successfully fetched roaster.', roaster: roaster }, 200);
  }
  async getRoasterByMonth(req, res) {
    var roaster = await this.service.getRoasterbyMonth(req.params);
    ReS(res, { message: 'Successfully fetched Roasters based on Month.', roaster: roaster }, 200);
  }
  async createRoaster(req, res) {
    try {
      var roaster = await this.service.createRoaster(req.user.user_key_id, req.body);
      ReS(res, { message: 'Successfully Created Roaster Details for Trailer', roaster: roaster }, 201);
    } catch (error) {
      return ReE(res, { message: error.message }, 400);
    }
  }

  async updateRoaster(req, res) {
    var roaster = await this.service.updateRoaster(req.user.user_key_id, req.params.id, req.body);
    ReS(res, { message: 'Successfully Updated Roaster Details', roaster: roaster }, 200);
  }

  async getIntel(req, res) {
    var intel = await this.service.getIntel(req.params);
    ReS(res, { message: 'Successfully Fetched Trip Intelligence', intel: intel }, 200);
  }

  async getIntelById(req, res) {
    var intel = await this.service.getIntelById(req.params);
    ReS(res, { message: 'Successfully Fetched Trip Intelligence Details', intel: intel }, 200);
  }

  async createIntel(req, res) {
    var intel = await this.service.createIntel(req.user.user_key_id, req.body);
    ReS(res, { message: 'Successfully Created Trip Intelligence Details', intel: intel }, 201);
  }

  async updateIntel(req, res) {
    var intel = await this.service.updateIntel(req.params.id, req.body);
    ReS(res, { message: 'Successfully Updated Trip Intelligence Details', intel: intel }, 200);
  }

  async getTags(req, res) {
    var tags = await this.service.getTags(req.params);
    ReS(res, { message: 'Successfully fetched tags.', tags: tags }, 200);
  }

  async getTagsById(req, res) {
    var tags = await this.service.getTagsById(req.params);
    ReS(res, { message: 'Successfully fetched tag.', tags: tags }, 200);
  }

  async createTag(req, res) {
    try {
      var tags = await this.service.createTag(req.user.user_key_id, req.body);
      ReS(res, { message: 'Successfully Created Mobile Details For Trailer', tags: tags }, 201);
    } catch (error) {
      return ReE(res, { message: error.message }, 400);
    }
  }

  async updateTag(req, res) {
    var tags = await this.service.updateTag(req.params.id, req.body);
    ReS(res, { message: 'Successfully Updated Mobile Details For Trailer', tags: tags }, 200);
  }

  async getUserTypes(req, res) {
    var users = await this.service.getUserTypes(req.params);
    ReS(res, { message: 'Successfully fetched master users.', users: users }, 200);
  }

  async getMasterUsers(req, res) {
    var users = await this.service.getMasterUsers(req.params);
    ReS(res, { message: 'Successfully fetched master users.', users: users }, 200);
  }

  async getUsers(req, res) {
    var users = await this.service.getUsers(req.params);
    ReS(res, { message: 'Successfully fetched users.', users: users }, 200);
  }

  async getUsersActive(req, res) {
    var users = await this.service.getUsersActive(req.params);
    ReS(res, { message: 'Successfully fetched Active Users.', users: users }, 200);
  }

  async getUsersById(req, res) {
    var users = await this.service.getUsersById(req.params);
    ReS(res, { message: 'Successfully fetched users.', users: users }, 200);
  }

  async createUser(req, res) {
    try {
      var users = await this.service.createUser(req.user.user_key_id, req.body);
      ReS(res, { message: 'Successfully Created User Details For Employee ID', users: users }, 201);
    } catch (error) {
      return ReE(res, { message: error.message }, 400);
    }
  }

  async updateUser(req, res) {
    var users = await this.service.updateUser(req.body);
    ReS(res, { message: 'Successfully Updated User Details For Employee ID', users: users }, 200);
  }

}

module.exports = AdminController;