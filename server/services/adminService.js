'use strict';
const formidable = require('formidable')
var db = require('../db/db.js');
var uploadService = require('../util/uploadUtilService.js');
var UserService = require('../services/userService.js');
const { to, TE } = require('./utilService');
const encryptUtil = require('../util/encryptUtil.js');
// const { uploadToCloudinary } = require('../util/uploadUtilVendorServiceFile.js');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'df8kh60xu',
  api_key: '261529189275742',
  api_secret: 'OBVYsKSfjhTp0dTdwmYD4djzX-8',
});

class AdminService {
  constructor() {
    this.userService = new UserService();
    this.db = db;
    this.uploadService = uploadService;
  };

  async getTrips() {
    //const id=query;
    var result = await this.db.query('select admin_trip_id as tripId, type, admin_trip_start_loc as startLoc, admin_trip_end_loc as endLoc, admin_trip_distance as distance, admin_trip_fuel_req as fuelReq, admin_trip_dri_inc as driInc, admin_trip_cr_dt as created, admin_trip_mod_dt as modified, admin_trip_status as status, admin_id as userId, admin_trip_type_id as tripTypeId, container_type as contType, container_wt as contWt from admin_trip ');// where DATE_FORMAT(admin_trip_cr_dt, \'%Y-%m-%d\')=DATE_FORMAT(SYSDATE(), \'%Y-%m-%d\')');
    // console.log(result);
    return result;
  };

  async getTripsById(query) {
    const { id } = query;
    var result = await this.db.query('select admin_trip_id as tripId, type, admin_trip_start_loc as startLoc, admin_trip_end_loc as endLoc, admin_trip_distance as distance, admin_trip_fuel_req as fuelReq, admin_trip_dri_inc as driInc, admin_trip_cr_dt as created, admin_trip_mod_dt as modified, admin_trip_status as status, admin_id as userId, admin_trip_type_id as tripTypeId, container_type as contType, container_wt as contWt from admin_trip where admin_trip_id = ? ', [id]);//and ut.exp_start_time=DATE_FORMAT(SYSDATE(), \'%Y-%m-%d\') 
    // console.log(result);
    return result;
  };

  async createTrips(userId, input) {
    const { type, startLoc, endLoc, distance, fuelReq, driInc, tripTypeId, contType, contWt } = input
    var sql = 'INSERT INTO `admin_trip` (`type`,`admin_trip_start_loc`,`admin_trip_end_loc`,`admin_trip_distance`,`admin_trip_fuel_req`,`admin_trip_dri_inc`,`admin_trip_cr_dt`,`admin_trip_mod_dt`,`admin_trip_status`,`admin_id`,`admin_trip_type_id`,`container_type`,`container_wt`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var values = [type, startLoc, endLoc, distance, fuelReq, driInc, new Date(), new Date(), 'a', userId, tripTypeId, contType, contWt];
    var result = await this.db.query(sql, values);
    // console.log(result)
    return ` with Trip ID: ${result.insertId}`;
  };

  async updateTrips(inputId, input) {
    const id = parseInt(inputId)
    const { fuelReq, driInc, status } = input

    await this.db.query(
      'UPDATE admin_trip SET admin_trip_fuel_req = ?, admin_trip_dri_inc = ?, admin_trip_status=?, admin_trip_mod_dt=now() WHERE admin_trip_id = ?',
      [fuelReq, driInc, status, id])
    return ` with Trip ID: ${id}`;
  };

  async deleteTrip(input) {
    const id = parseInt(input)
    await this.db.query('DELETE FROM admin_trip WHERE admin_trip_id = ?', [id])
    return `Trip deleted with ID: ${id}`;
  };


  async getFiles() {
    //const id=query;
    var result = await this.db.query('select `admin_file_upload_id` as fileId,`admin_file_upload_file_type` as fileType,`admin_file_upload_filename` as fileName,`admin_file_upload_dt` as fileDt,`admin_file_upload_mode` as uploadMode,`admin_file_upload_admin_id` as uploadAdminId,`admin_file_upload_type_id` as fileTypeID from admin_file_upload');
    // console.log(result);
    return result;
  };

  async getFilesById(query) {
    const { id } = query;
    var result = await this.db.query('select `admin_file_upload_id` as fileId,`admin_file_upload_file_type` as fileType,`admin_file_upload_filename` as fileName,`admin_file_upload_dt` as fileDt,`admin_file_upload_mode` as uploadMode,`admin_file_upload_admin_id` as uploadAdminId,`admin_file_upload_type_id` as fileTypeID from admin_file_upload  where admin_file_upload_id = ?', [id]);
    // console.log(result);
    return result;
  };

  async uploadFiles(file) {
    //const { file, fileType, fileName, uploadMode, uploadAdminId, fileTypeID } = input;
    var result = await this.uploadService.fileUpload(file.path, file.name + "_" + Date.now());
    // console.log(result)
    return `Files uploaded successfully`;
  };


  async getVendors() {
    //const id=query;
    var result = await this.db.query('select `admin_vendor_id` as vendorId,`admin_vendor_name` as vendorname,`admin_vendor_off_loc` as location,`admin_vendor__desig` as designation,`admin_vendor__con_person` as contactperson,`admin_vendor_con_num` as contactnumber,`admin_vendor_con_email` as contactemail,`admin_vendor_com_name` as comName,`admin_vendor_cat_id` as catId,`admin_vendor_dept_id` as deptId,`admin_vendor_prod_ser_pf_id` as serPfId,`admin_vendor_type_id` as typeId,`admin_kyc_type_ID` as kycTypeId,`admin_kyc__no` as kycNumber,`admin_id` as adminId from admin_vendor ');
    // console.log(result);
    return result;
  };

  async getVendorsById(query) {
    const { id } = query;
    var result = await this.db.query('select `admin_vendor_id` as vendorId,`admin_vendor_name` as vendorName,`admin_vendor_off_loc` as offLoc,`admin_vendor__desig` as desig,`admin_vendor__con_person` as conPerson,`admin_vendor_con_num` as conNum,`admin_vendor_con_email` as conEmail,`admin_vendor_com_name` as comName,`admin_vendor_cat_id` as catId,`admin_vendor_dept_id` as deptId,`admin_vendor_prod_ser_pf_id` as serPfId,`admin_vendor_type_id` as typeId,`admin_kyc_type_ID` as kycTypeId,`admin_kyc__no` as kycNo,`admin_id` as adminId from admin_vendor where admin_id = ?', [id]);
    // console.log(result);
    return result;
  };

  static async createVendors(input) {
    const { vendorname, location, contactperson, designation, contactnumber, contactemail, kycTypeId, kycNumber, contactperson2, designation2, contactnumber2, contactemail2, vendortype, adminUser, fileUrl } = input;

    var id = await db.query('select `admin_id` as adminID from admin_user where admin_user = ?', [adminUser]);
    //   console.log("Admin : ", id[0].adminID);

    var VendorTypeId = await db.query('select `admin_vendor_type_id` as venderTypeId from admin_vendor_type where admin_vendor_type_name = ?', [vendortype]);
    //   console.log("VendorTypeId : ", VendorTypeId[0].venderTypeId);

    if (vendortype === "Individual") {
      var sql = 'INSERT INTO `admin_vendor` (`admin_vendor_name`,`admin_vendor_off_loc`,`admin_vendor__desig`,`admin_vendor__con_person`,`admin_vendor_con_num`,`admin_vendor_con_email`,`admin_vendor_com_name`,`admin_vendor_cat_id`,`admin_vendor_dept_id`,`admin_vendor_prod_ser_pf_id`,`admin_vendor_type_id`,`admin_kyc_type_ID`,`admin_kyc__no`,`admin_id`) VALUES (?,?,?,?,?,?,NULL,NULL,NULL,NULL,?,?,?,?)';

      var values = [vendorname, location, designation, contactperson, contactnumber, contactemail, VendorTypeId[0].venderTypeId, kycTypeId, kycNumber, id[0].adminID];

      var result = await db.query(sql, values);

      var sql = 'INSERT INTO `admin_vendor_agre_file` (`admin_vendor_agre_file_vendor_id`,`admin_vendor_agre_file_vendor_name`,`admin_vendor_agre_file_path`,`admin_vendor_agre_file_cr_dt`) VALUES (?,?,?,?)';

      var values = [result.insertId, vendorname, fileUrl, new Date()];

      var result1 = await db.query(sql, values);


      return `Vendor added successfuly with ID: ${result.insertId}`;
    }

    else if (vendortype === "Business") {
      var sql = 'INSERT INTO `admin_vendor` (`admin_vendor_name`,`admin_vendor_off_loc`,`admin_vendor__desig`,`admin_vendor__con_person`,`admin_vendor_con_num`,`admin_vendor_con_email`,`admin_vendor_com_name`,`admin_vendor_cat_id`,`admin_vendor_dept_id`,`admin_vendor_prod_ser_pf_id`,`admin_vendor_type_id`,`admin_kyc_type_ID`,`admin_kyc__no`,`admin_id`) VALUES (?,?,?,?,?,?,NULL,NULL,NULL,NULL,?,?,?,?)';

      var values = [vendorname, location, designation, contactperson, contactnumber, contactemail, VendorTypeId[0].venderTypeId, kycTypeId, kycNumber, id[0].adminID];

      var result = await db.query(sql, values);

      var sql = 'INSERT INTO `admin_vendor_agre_file` (`admin_vendor_agre_file_vendor_id`,`admin_vendor_agre_file_vendor_name`,`admin_vendor_agre_file_path`,`admin_vendor_agre_file_cr_dt`) VALUES (?,?,?,?)';

      var values = [result.insertId, vendorname, fileUrl, new Date()];

      var result1 = await db.query(sql, values);


      return `Vendor added successfuly with ID: ${result.insertId}`;
    }

    return `Vendor added successfuly with ID: ${id}`;
  }

  // async createVendors(input) {
  //   const { vendorname, location, contactperson, designation, contactnumber, contactemail, kycTypeId, kycNumber, contactperson2, designation2, contactnumber2, contactemail2, vendortype, adminUser } = input
  //   console.log(input);

  //   var id = await db.query('select `admin_id` as adminID from admin_user where admin_user = ?', [adminUser]);
  //   console.log("Admin : ", id[0].adminID);

  //   var VendorTypeId = await db.query('select `admin_vendor_type_id` as venderTypeId from admin_vendor_type where admin_vendor_type_name = ?', [vendortype]);
  //   console.log("VendorTypeId : ", VendorTypeId[0].venderTypeId);

  //   // if (vendortype === "Individual") {
  //   //   var sql = 'INSERT INTO `admin_vendor` (`admin_vendor_name`,`admin_vendor_off_loc`,`admin_vendor__desig`,`admin_vendor__con_person`,`admin_vendor_con_num`,`admin_vendor_con_email`,`admin_vendor_com_name`,`admin_vendor_cat_id`,`admin_vendor_dept_id`,`admin_vendor_prod_ser_pf_id`,`admin_vendor_type_id`,`admin_kyc_type_ID`,`admin_kyc__no`,`admin_id`) VALUES (?,?,?,?,?,?,NULL,NULL,NULL,NULL,?,?,?,?)';

  //   //   var values = [vendorname, location, designation, contactperson, contactnumber, contactemail, VendorTypeId[0].venderTypeId, kycTypeId, kycNumber, id[0].adminID];

  //   //   var result = await this.db.query(sql, values);
  //   //   return `Vendor added successfuly with ID: ${result.insertId}`;
  //   // }
  //   // else if (vendortype === "Business") {
  //   //   var sql = 'INSERT INTO `admin_vendor` (`admin_vendor_name`,`admin_vendor_off_loc`,`admin_vendor__desig`,`admin_vendor__con_person`,`admin_vendor_con_num`,`admin_vendor_con_email`,`admin_vendor_com_name`,`admin_vendor_cat_id`,`admin_vendor_dept_id`,`admin_vendor_prod_ser_pf_id`,`admin_vendor_type_id`,`admin_kyc_type_ID`,`admin_kyc__no`,`admin_id`) VALUES (?,?,?,?,?,?,NULL,NULL,NULL,NULL,?,?,?,?)';

  //   //   var values = [vendorname, location, designation, contactperson, contactnumber, contactemail, VendorTypeId[0].venderTypeId, kycTypeId, kycNumber, id[0].adminID];

  //   //   var result = await this.db.query(sql, values);
  //   //   return `Vendor added successfuly with ID: ${result.insertId}`;
  //   // }
  //   // var sql = 'INSERT INTO `admin_vendor` (`admin_vendor_name`,`admin_vendor_off_loc`,`admin_vendor__desig`,`admin_vendor__con_person`,`admin_vendor_con_num`,`admin_vendor_con_email`,`admin_vendor_com_name`,`admin_vendor_cat_id`,`admin_vendor_dept_id`,`admin_vendor_prod_ser_pf_id`,`admin_vendor_type_id`,`admin_kyc_type_ID`,`admin_kyc__no`,`admin_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  //   // var values = [vendorName, offLoc, desig, conPerson, conNum, conEmail, comName, catId, deptId, serPfId, typeId, kycTypeId, kycNo, adminId];
  //   // // console.log(values)
  //   // var result = await this.db.query(sql, values);
  //   // console.log(result)
  //   // return `Vendor added successfuly with ID: ${result.insertId}`;
  //   return `Vendor added successfuly with ID: ${adminUser}`;
  // };

  async updateVendors(input, id) {
    // console.log(input);

    const { vendorId, vendorname, location, contactperson, designation, contactnumber, contactemail, kycTypeId, kycNumber, vendortype, adminUser, contactperson2, contactemail2, contactnumber2, designation2 } = input;

    var id = await this.db.query('select `admin_id` as adminID from admin_user where admin_user = ?', [adminUser]);
    // console.log("Admin : ", id[0].adminID);

    var VendorTypeId = await this.db.query('select `admin_vendor_type_id` as venderTypeId from admin_vendor_type where admin_vendor_type_name = ?', [vendortype]);
    // console.log("VendorTypeId : ", VendorTypeId[0].venderTypeId);

    if (vendortype === "Individual") {
      var sql = 'UPDATE admin_vendor SET admin_vendor_id = ?, admin_vendor_name = ?, admin_vendor_off_loc = ?, admin_vendor__desig = ?, admin_vendor__con_person= ?, admin_vendor_con_num = ?, admin_vendor_con_email = ?, admin_vendor_com_name = NULL, admin_vendor_cat_id = NULL, admin_vendor_dept_id = NULL, admin_vendor_prod_ser_pf_id = NULL, admin_vendor_type_id = ?, admin_kyc_type_ID = ?, admin_kyc__no = ?, admin_id = ? WHERE admin_vendor_id = ?';
      var values = [vendorId, vendorname, location, designation, contactperson, contactnumber, contactemail, VendorTypeId[0].venderTypeId, kycTypeId, kycNumber, id[0].adminID, vendorId];

      var result = await this.db.query(sql, values);

      return `Vendor updated successfuly with ID: ${result.insertId}`;
    }
    else if (vendortype === "Business") {
      var sql = 'UPDATE admin_vendor SET admin_vendor_id = ?, admin_vendor_name = ?, admin_vendor_off_loc = ?, admin_vendor__desig = ?, admin_vendor__con_person= ?, admin_vendor_con_num = ?, admin_vendor_con_email = ?, admin_vendor_com_name = NULL, admin_vendor_cat_id = NULL, admin_vendor_dept_id = NULL, admin_vendor_prod_ser_pf_id = NULL, admin_vendor_type_id = ?, admin_kyc_type_ID = ?, admin_kyc__no = ?, admin_id = ? WHERE admin_vendor_id = ?';
      var values = [vendorId, vendorname, location, designation, contactperson, contactnumber, contactemail, VendorTypeId[0].venderTypeId, kycTypeId, kycNumber, id[0].adminID, vendorId];

      var result = await this.db.query(sql, values);

      return `Vendor updated successfuly with ID: ${result.insertId}`;
    }

    // await this.db.query(
    //   'UPDATE admin_vendor SET admin_vendor_id = ?, admin_vendor_name = ?, admin_vendor_off_loc = ?, admin_vendor__desig = ?, admin_vendor__con_person= ?, admin_vendor_con_num = ?, admin_vendor_con_email = ?, admin_vendor_com_name = ?, admin_vendor_cat_id = ?, admin_vendor_dept_id = ?, admin_vendor_prod_ser_pf_id = ?, admin_vendor_type_id = ?, admin_kyc_type_ID = ?, admin_kyc__no = ?, admin_id = ? WHERE admin_vendor_id = ?',
    //   [vendorId, vendorName, offLoc, desig, conPerson, conNum, conEmail, comName, catId, deptId, serPfId, typeId, kycTypeId, kycNo, adminId, id]
    // )
    return `Vendor modified with ID: ${1}`;
  };

  // Function to upload file to Cloudinary
  async uploadFileToCloudinary(file) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, {
        folder: 'TG_APP', // Specify the folder name
        public_id: file.originalFilename.split('.')[0], // Use original file name
        resource_type: 'auto', // Automatically detect the file type
      }, (error, result) => {
        // Remove the file from local storage after uploading to Cloudinary
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Error deleting local file:', err);
          }
        });

        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  }

  // Get Vendor Services
  async getVendorService() {

    var serviceResult = await this.db.query('select `admin_vendor_service_id` as vendorServiceId, `admin_vendor_name` as vendorName, `admin_vendor_dept_id` as departmentId, `admin_vendor_service_cost_type_id` as serviceCostTypeId, `admin_vendor_type_id` as vendorTypeId, `admin_vendor_service_type_id` as serviceTypeId, `admin_id` as adminId, `admin_vendor_cat_id` as vendorCategoryId, `admin_vendor_service_base_cost` as serviceBaseCost from admin_vendor_service where admin_vendor_service_status = ?', ["A"]);

    var taxResult = await this.db.query('select `admin_vendor_service_tax_id` as vendorServiceTaxId, `admin_vendor_service_id` as vendorServiceIdtax, `admin_vendor_service_tax_name` as serviceTaxName, `admin_vendor_service_tax_percentage` as serviceTaxPercentage, `admin_vendor_service_tax_cost` as serviceTaxCost, `admin_id` as adminId from admin_vendor_service_tax where admin_vendor_service_tax_status = ?', ["A"]);

    // var serviceResult = await this.db.query('SELECT * FROM admin_vendor_service');
    // var taxResult = await this.db.query('SELECT * FROM admin_vendor_service_tax');
    var combinedResult = {
      serviceData: serviceResult,
      taxData: taxResult
    };
    return combinedResult;
  }

  // Create vendor services
  async createVendorService(input) {
    const { vname, categorytype, departmenttype, servicetype, servicecosttype, serviceplantype, servicebasiccost, taxFields, adminUser } = input;
    // console.log(input);

    var id = await this.db.query('select `admin_id` as adminID from admin_user where admin_user = ?', [adminUser]);
    // console.log("Admin : ",id[0].adminID);
    var vendortypeid = await this.db.query('select `admin_vendor_type_id` as vtypeId from admin_vendor where admin_vendor_name = ?', [vname]);
    // console.log("Vendor Type Id : ", vendortypeid[0].vtypeId);

    var vendorserviceid;
    var result;

    if (vendortypeid[0].vtypeId) {
      var sql = 'INSERT INTO `admin_vendor_service` (`admin_vendor_name`,`admin_vendor_dept_id`,`admin_vendor_service_cost_type_id`,`admin_vendor_type_id`,`admin_vendor_service_type_id`,`admin_id`,`admin_vendor_cat_id`,`admin_vendor_service_base_cost`,`admin_vendor_service_status`) VALUES (?,?,?,?,?,?,?,?,?)';
      var values = [vname, departmenttype, servicecosttype, vendortypeid[0].vtypeId, servicetype, id[0].adminID, categorytype, servicebasiccost, "A"];
      result = await this.db.query(sql, values);
      // console.log(result);
      vendorserviceid = result.insertId;

      if (vendorserviceid) {
        for (let i = 0; i < taxFields.length; i++) {
          var sql = 'INSERT INTO `admin_vendor_service_tax` (`admin_vendor_service_id`,`admin_vendor_service_tax_name`,`admin_vendor_service_tax_percentage`,`admin_vendor_service_tax_cost`,`admin_vendor_service_tax_status`,`admin_id`) VALUES (?,?,?,?,?,?)';
          var values = [vendorserviceid, taxFields[i].taxName, taxFields[i].percentage, taxFields[i].totalValue, "A", id[0].adminID];
          var result = await this.db.query(sql, values);
          // console.log(result);
        }
      }

      return `Vendor service created: ${result.insertId}`;
    }

    return `Vendor service created: ${result.insertId}`;
  }

  // Update service
  async updateVendorService(input, id) {
    // console.log(input);

    const { vendorserviceid, adminid, vendorServiceTaxId, vname, categorytype, departmenttype, servicetype, servicecosttype, serviceplantype, servicebasiccost, vendortypeid, taxFields } = input;

    var sql = 'UPDATE admin_vendor_service SET admin_vendor_service_id = ?, admin_vendor_name = ?, admin_vendor_dept_id = ?, admin_vendor_service_cost_type_id = ?, admin_vendor_type_id = ?, admin_vendor_service_type_id = ?, admin_id = ?, admin_vendor_cat_id = ?, admin_vendor_service_base_cost = ?, admin_vendor_service_status = ? WHERE admin_vendor_service_id = ?';

    var values = [vendorserviceid, vname, departmenttype, servicecosttype, vendortypeid, servicetype, adminid, categorytype, servicebasiccost, "A", vendorserviceid];

    var result = await this.db.query(sql, values);

    if (vendorserviceid) {
      for (let i = 0; i < taxFields.length; i++) {
        var sql = 'UPDATE admin_vendor_service_tax SET admin_vendor_service_tax_id = ?, admin_vendor_service_id = ?, admin_vendor_service_tax_name = ?, admin_vendor_service_tax_percentage = ?, admin_vendor_service_tax_cost = ?, admin_vendor_service_tax_status = ?, admin_id = ? WHERE admin_vendor_service_tax_id = ?';
        var values = [vendorServiceTaxId[i], vendorserviceid, taxFields[i].taxName, taxFields[i].percentage, taxFields[i].totalValue, "A", adminid, vendorServiceTaxId[i]];
        var result = await this.db.query(sql, values);
        // console.log(result);
      }
    }

    // return `Vendor service updated successfuly with ID: ${result.insertId}`;

    return `Vendor service updated successfuly with ID: ${1}`;
  }

  // Get types
  async getTypes() {
    var result = await this.db.query('select `admin_vendor_cat_name` as categoryTypeName, NULL AS departmentTypeName, NULL AS serviceTypeName, NULL AS serviceCostTypeName, NULL AS vendorTypeName, NULL AS servicePlanTypeName from admin_vendor_cat UNION ALL select NULL AS categoryTypeName, `admin_vendor_dept_name` as departmentTypeName, NULL AS serviceTypeName, NULL AS serviceCostTypeName, NULL AS vendorTypeName, NULL AS servicePlanTypeName from admin_vendor_dept UNION ALL select NULL AS categoryTypeName, NULL AS departmentTypeName, `admin_vendor_service_type_name` as serviceTypeName, NULL AS serviceCostTypeName, NULL AS vendorTypeName, NULL AS servicePlanTypeName from admin_vendor_service_type UNION ALL select NULL AS categoryTypeName, NULL AS departmentTypeName, NULL AS serviceTypeName, `admin_vendor_service_cost_type_name` as serviceCostTypeName, NULL AS vendorTypeName, NULL AS servicePlanTypeName from admin_vendor_service_cost_type UNION ALL select NULL AS categoryTypeName, NULL AS departmentTypeName, NULL AS serviceTypeName, NULL AS serviceCostTypeName, `admin_vendor_type_name` as vendorTypeName, NULL AS servicePlanTypeName from admin_vendor_type UNION ALL select NULL AS categoryTypeName, NULL AS departmentTypeName, NULL AS serviceTypeName, NULL AS serviceCostTypeName, NULL AS vendorTypeName, `admin_vendor_service_plan_type_name` as servicePlanTypeName from admin_vendor_service_plan_type');
    // console.log(result);
    return result;
  }

  // Create types
  async createTypes(input) {
    const { categoryName, categoryDescription, departmentName, departmentDescription, kycTypeName, kycTypeDescription, serviceName, serviceDescription, serviceCostTypeName, serviceCostTypeDescription, servicePlanTypeName, servicePlanTypeDescription, vendorTypeName, vendorTypeDescription, type, } = input;

    if (type === "Category Type") {
      var sql = 'INSERT INTO `admin_vendor_cat` (`admin_vendor_cat_status`,`admin_vendor_cat_name`,`admin_vendor_cat_desc`) VALUES (?,?,?)';
      var values = ["A", categoryName, categoryDescription];
      var result = await this.db.query(sql, values);
      // console.log(result);

    } else if (type === "Department Type") {
      var sql = 'INSERT INTO `admin_vendor_dept` (`admin_vendor_dept_name`,`admin_vendor_dept_desc`,`admin_vendor_dept_status`) VALUES (?,?,?)';
      var values = [departmentName, departmentDescription, "A"];
      var result = await this.db.query(sql, values);
      // console.log(result);

    } else if (type === "KYC Type") {
      var sql = 'INSERT INTO `admin_kyc_type` (`admin_kyc_type_name`,`admin_kyc_type_desc`,`admin_kyc_type_status`) VALUES (?,?,?)';
      var values = [kycTypeName, kycTypeDescription, "A"];
      var result = await this.db.query(sql, values);
      // console.log(result);

    } else if (type === "Service Type") {
      var sql = 'INSERT INTO `admin_vendor_service_type` (`admin_vendor_service_type_name`,`admin_vendor_service_type_desc`,`admin_vendor_service_type_status`) VALUES (?,?,?)';
      var values = [serviceName, serviceDescription, "A"];
      var result = await this.db.query(sql, values);
      // console.log(result);

    } else if (type === "Service Cost Type") {
      var sql = 'INSERT INTO `admin_vendor_service_cost_type` (`admin_vendor_service_cost_type_name`,`admin_vendor_service_cost_type_desc`,`admin_vendor_service_cost_type_status`) VALUES (?,?,?)';
      var values = [serviceCostTypeName, serviceCostTypeDescription, "A"];
      var result = await this.db.query(sql, values);
      // console.log(result);

    } else if (type === "Service Plan Type") {
      var sql = 'INSERT INTO `admin_vendor_service_plan_type` (`admin_vendor_service_plan_type_name`,`admin_vendor_service_plan_type_desc`,`admin_vendor_service_plan_type_status`) VALUES (?,?,?)';
      var values = [servicePlanTypeName, servicePlanTypeDescription, "A"];
      var result = await this.db.query(sql, values);
      // console.log(result);

    } else if (type === "Vendor Type") {
      var sql = 'INSERT INTO `admin_vendor_type` (`admin_vendor_type_name`,`admin_vendor_type_desc`,`admin_vendor_type_status`) VALUES (?,?,?)';
      var values = [vendorTypeName, vendorTypeDescription, "A"];
      var result = await this.db.query(sql, values);
      // console.log(result);

    }

    return `Type added successfuly : ${result.insertId}`;
  }

  async getRoaster() {
    var result = await this.db.query('select `admin_driver_roaster_id` as roasterId,`admin_driver_roaster_cr_dt` as roasterCrDt,`admin_driver_roaster_dri_shift1` as shift1, `admin_driver_roaster_dri_shift1_system_user_id` as shiftID1, `admin_driver_roaster_dri_shift2` as shift2, `admin_driver_roaster_dri_shift2_system_user_id` as shiftID2,`admin_driver_roaster_trailer_no` as roasterTrailerNo,`admin_driver_roaster_mod_dt` as roasterModDt, `admin_driver_roaster_year` as roasterYear, `admin_driver_roaster_month` as roasterMonth, `admin_driver_roaster_status` as roasterStatus, `admin_id` as adminId from admin_driver_roaster where admin_driver_roaster_status = ? ', ['A']);
    // console.log(result);
    return result;
  };

  async getRoasterById(query) {
    const { id } = query;
    var result = await this.db.query('select `admin_driver_roaster_id` as roasterId,`admin_driver_roaster_cr_dt` as roasterCrDt,`admin_driver_roaster_dri_shift1` as roasterDriShift1,`admin_driver_roaster_dri_shift2` as roasterDriShift2,`admin_driver_roaster_trailer_no` as roasterTrailerNo,`admin_driver_roaster_mod_dt` as roasterModDt,`admin_driver_roaster_year` as roasterYear, `admin_driver_roaster_month` as roasterMonth,`admin_driver_roaster_status` as roasterStatus, `admin_id` as adminId from admin_driver_roaster  where admin_driver_roaster_id = ?', [id]);
    // console.log(result);
    return result;
  };

  async getRoasterbyMonth(query) {
    const { month } = query;
    var result = await this.db.query('select `admin_driver_roaster_id` as roasterId,`admin_driver_roaster_cr_dt` as roasterCrDt,`admin_driver_roaster_dri_shift1`as shift1, `admin_driver_roaster_dri_shift1_system_user_id` as shiftID1, `admin_driver_roaster_dri_shift2` as shift2, `admin_driver_roaster_dri_shift2_system_user_id` as shiftID2,`admin_driver_roaster_leave_day` as leaveDay,`admin_driver_roast_shift1_leave` as shift1Leave,`admin_driver_roast_shift1_leave_system_user_id` as shiftID1Leave,`admin_driver_roaster_shift2_leave` as shift2leave,`admin_driver_roast_shift2_leave_system_user_id` as shift2IDLeave,`admin_driver_roaster_trailer_no` as roasterTrailerNo, `admin_driver_roaster_mod_dt` as roasterModDt, `admin_driver_roaster_year` as roasterYear, `admin_driver_roaster_month` as roasterMonth, `admin_driver_roaster_status` as roasterStatus, `admin_id` as adminId from admin_driver_roaster where admin_driver_roaster_status = ? and ? between month(admin_driver_roaster_st_dt) and month(admin_driver_roaster_end_dt)', ['A', month]);
    // console.log(result);
    return result;
  };

  async getRoasterByTrailerNo(trailerNo, yearCreate, monthCreate, roasterStatus) {
    // var result=await this.db.query('select `admin_driver_roaster_id` as roasterId,`admin_driver_roaster_cr_dt` as roasterCrDt, `admin_driver_roaster_dri_shift1`,`admin_driver_roaster_dri_shift1_system_user_id`,`admin_driver_roaster_dri_shift2`,`admin_driver_roaster_dri_shift2_system_user_id`,`admin_driver_roaster_trailer_no` as roasterTrailerNo,`admin_driver_roaster_mod_dt` as roasterModDt,`admin_driver_roaster_year` as roasterYear, `admin_driver_roaster_month` as roasterMonth,`admin_driver_roaster_status` as roasterStatus, `admin_id` as adminId from admin_driver_roaster  where admin_driver_roaster_trailer_no =? and admin_driver_roaster_year =? and admin_driver_roaster_month =? and admin_driver_roaster_status=?', [trailerNo,roasterYear,roasterMonth,'A']);
    var result = await this.db.query('select `admin_driver_roaster_id` as roasterId,`admin_driver_roaster_cr_dt` as roasterCrDt, `admin_driver_roaster_dri_shift1`,`admin_driver_roaster_dri_shift1_system_user_id`, `admin_driver_roaster_dri_shift2`,`admin_driver_roaster_dri_shift2_system_user_id`,`admin_driver_roaster_leave_day` as leaveDay, `admin_driver_roast_shift1_leave`,`admin_driver_roast_shift1_leave_system_user_id`,`admin_driver_roaster_shift2_leave`,`admin_driver_roast_shift2_leave_system_user_id`,`admin_driver_roaster_trailer_no` as roasterTrailerNo,`admin_driver_roaster_mod_dt` as roasterModDt, `admin_driver_roaster_year` as roasterYear, `admin_driver_roaster_month` as roasterMonth, `admin_driver_roaster_status` as roasterStatus, `admin_id` as adminId from admin_driver_roaster where admin_driver_roaster_trailer_no =? and  admin_driver_roaster_status=? and ? between year(admin_driver_roaster_st_dt) and year(admin_driver_roaster_end_dt) and ? between month(admin_driver_roaster_st_dt) and month(admin_driver_roaster_end_dt)', [trailerNo, 'A', yearCreate, monthCreate]);
    // console.log(result, "Result of Blocked Month & Year");
    return result;
  };

  async createRoaster(adminId, input) {
    const { roasterFromDate, roasterToDate, roasterDriShift1, roasterDriShiftID1, roasterDriShift2, roasterDriShiftID2, leaveDay, roasterDriShift3Leave, roasterDriShift3LeaveID, roasterDriShift4Leave, roasterDriShift4LeaveID, roasterTrailerNo, roasterStatus, startDate, endDate, roasterYear, roasterMonth, yearCreate, monthCreate } = input
    let roasterData = await this.getRoasterByTrailerNo(roasterTrailerNo, yearCreate, monthCreate, roasterStatus);
    if (roasterData.length > 0) {
      console.error('Roaster Details already exists for Trailer');
      TE('Roaster Details already exists for Trailer');
    }
    let start, end;
    if (startDate == "" && endDate == "") {
      console.log('Create Roaster called from ui');
      start = new Date(roasterFromDate);
      end = new Date(roasterToDate);
    } else {
      console.log('Create Roaster called from Update Roaster');
      start = new Date(startDate);
      end = new Date(endDate);
    }

    var sql = 'INSERT INTO `admin_driver_roaster` (`admin_driver_roaster_cr_dt`,`admin_driver_roaster_dri_shift1`,`admin_driver_roaster_dri_shift1_system_user_id`,`admin_driver_roaster_dri_shift2`,`admin_driver_roaster_dri_shift2_system_user_id`, `admin_driver_roaster_leave_day`, `admin_driver_roast_shift1_leave`,`admin_driver_roast_shift1_leave_system_user_id`, `admin_driver_roaster_shift2_leave`,`admin_driver_roast_shift2_leave_system_user_id`,`admin_driver_roaster_trailer_no`,`admin_driver_roaster_mod_dt`,`admin_driver_roaster_status`,`admin_id`,`admin_driver_roaster_st_dt`,`admin_driver_roaster_end_dt`, `admin_driver_roaster_year`, `admin_driver_roaster_month`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var values = [new Date(), roasterDriShift1, roasterDriShiftID1, roasterDriShift2, roasterDriShiftID2, leaveDay, roasterDriShift3Leave, roasterDriShift3LeaveID, roasterDriShift4Leave, roasterDriShift4LeaveID, roasterTrailerNo, new Date(), 'A', adminId, start, end, roasterYear, roasterMonth];
    var result = await this.db.query(sql, values);
    // console.log(result)
    return `Driver Roaster added with ID: ${result.insertId}`;
  };

  async updateRoaster(adminId, inputId, input) {
    const id = parseInt(inputId)
    const { roasterFromDate, roasterToDate, roasterTrailerNo, roasterDriShift1, roasterDriShiftID1, roasterDriShift2, roasterDriShiftID2, leaveDay, roasterDriShift1Leave, roasterDriShift1LeaveID, roasterDriShift2Leave, roasterDriShift2LeaveID, roasterStatus, startDate, endDate, roasterYear, roasterMonth } = input
    await this.db.query(
      'UPDATE admin_driver_roaster SET admin_driver_roaster_mod_dt = sysdate(), admin_driver_roaster_end_dt= ?, admin_driver_roaster_status = ? WHERE admin_driver_roaster_id = ?',
      [new Date(new Date(startDate).setDate(new Date(startDate).getDate() - 1)), 'i', id])
    var result = this.createRoaster(adminId, input);
    console.log(result);
    console.log(new Date(new Date(startDate).setDate(new Date(startDate).getDate() - 1)), "SELECTED DATE");
    return `Driver Roaster modified with ID: ${id}`;
  };

  async getIntel() {
    //const userId=query;
    var result = await this.db.query("select (select admin_trip_intel_wt from admin_trip_intel where admin_trip_intel_code ='IDLE01') as idleTime, (select admin_trip_intel_wt from admin_trip_intel where admin_trip_intel_code ='BSH02') as balShiftTime, (select admin_trip_intel_wt from admin_trip_intel where admin_trip_intel_code ='PEND03') as pendency, (select admin_trip_intel_wt from admin_trip_intel where admin_trip_intel_code ='PKUP04') as pickUpLoc, (select admin_trip_intel_wt from admin_trip_intel where admin_trip_intel_code ='CRT05') as compRoundTrip, (select admin_trip_intel_wt from admin_trip_intel where admin_trip_intel_code ='GRT06') as groundRent from dual");
    console.log(result);
    return result;
  };

  async getIntelById(query) {
    const { id } = query;
    var result = await this.db.query('select admin_id as userId, admin_trip_intel_id as intelId, admin_trip_intel_code as intelCode, admin_trip_intel_decs as intelDecs, admin_trip_intel_wt as intelWt, admin_trip_intel_status as intelStatus, admin_trip_intel_cr_dt as intelCrDt, admin_trip_intel_mod_dt as intelModDt from admin_trip_intel where admin_trip_intel_id=? ', [id]);
    console.log(result);
    return result;
  };

  async createIntel(userId, input) {
    var intels = await this.db.query('delete from admin_trip_intel');
    console.log(intels);
    const { idleTime, balShiftTime, pendency, pickUpLoc, compRoundTrip, groundRent } = input
    var sql = 'INSERT INTO `admin_trip_intel` (`admin_id`,`admin_trip_intel_code`,`admin_trip_intel_decs`,`admin_trip_intel_wt`,`admin_trip_intel_cr_dt`,`admin_trip_intel_mod_dt`,`admin_trip_intel_status`) VALUES ?';
    var values = [
      [userId, 'IDLE01', ' IDLE TIME WT', idleTime, new Date(), new Date(), 'A'],
      [userId, 'BSH02', 'BALANCE SHIFT WT', balShiftTime, new Date(), new Date(), 'A'],
      [userId, 'PEND03', 'PENDENCY WT', pendency, new Date(), new Date(), 'A'],
      [userId, 'PKUP04', 'PICK UP LOC WT', pickUpLoc, new Date(), new Date(), 'A'],
      [userId, 'CRT05', 'COMPLETE ROUND TRIP WT', compRoundTrip, new Date(), new Date(), 'A'],
      [userId, 'GRT06', 'GROUND RENT WT', groundRent, new Date(), new Date(), 'A']
    ];
    var result = await this.db.query(sql, [values]);
    console.log(result);
    return `Intel added with ID: ${result.insertId}`;
  };

  async updateIntel(inputId, input) {
    const id = parseInt(inputId)
    const { code, decs, wt } = input

    await this.db.query(
      'UPDATE admin_trip_intel SET admin_trip_intel_code = ?, admin_trip_intel_decs = ?, admin_trip_intel_wt=?, admin_trip_intel_mod_dt=SYSDATE() WHERE admin_trip_intel_id = ?',
      [code, decs, wt, id])
    return `Intel modified with ID: ${id}`;
  };

  async getTags() {
    //const id=query;
    var result = await this.db.query('select `admin_veh_mob_tag_id` as tagId, `admin_veh_mob_tag_veh_no` as vehNo, `admin_veh_mob_tag_mob_no` as vehMobNo, `admin_veh_mob_tag_mob_model` as vehMobModel, `admin_veh_mob_tag_imei_no` as imei, `admin_veh_mob_tag_os` as mobOs, `admin_veh_mob_tag_cr_dt` as crDt, `admin_veh_mob_tag_mod_dt` as modDt, `admin_veh_mob_tag_status` as status, `admin_id` as userId from admin_veh_mob_tag ');
    console.log(result);
    return result;
  };

  async getTagsById(query) {
    const id = query;
    var result = await this.db.query('select `admin_veh_mob_tag_id` as tagId, `admin_veh_mob_tag_veh_no` as vehNo, `admin_veh_mob_tag_mob_no` as vehMobNo, `admin_veh_mob_tag_mob_model` as vehMobModel, `admin_veh_mob_tag_imei_no` as imei, `admin_veh_mob_tag_os` as mobOs, `admin_veh_mob_tag_cr_dt` as crDt, `admin_veh_mob_tag_mod_dt` as modDt, `admin_veh_mob_tag_status` as status, `admin_id` as userId from admin_veh_mob_tag where admin_veh_mob_tag_id =? ', [id]);
    console.log(result);
    return result;
  };

  async getTagsByVehNo(query) {
    const id = query;
    var result = await this.db.query('select `admin_veh_mob_tag_id` as tagId, `admin_veh_mob_tag_veh_no` as vehNo, `admin_veh_mob_tag_mob_no` as vehMobNo, `admin_veh_mob_tag_mob_model` as vehMobModel, `admin_veh_mob_tag_imei_no` as imei, `admin_veh_mob_tag_os` as mobOs, `admin_veh_mob_tag_cr_dt` as crDt, `admin_veh_mob_tag_mod_dt` as modDt, `admin_veh_mob_tag_status` as status, `admin_id` as userId from admin_veh_mob_tag where admin_veh_mob_tag_veh_no =? ', [id]);
    console.log(result);
    return result;
  };

  async createTag(userId, input) {
    const { vehNo, mobileNum, model, imei, os, remarks } = input
    let tagData = await this.getTagsByVehNo(vehNo);
    if (tagData.length > 0) {
      TE('Mobile Details already exists for Trailer');
    }
    var sql = 'INSERT INTO `admin_veh_mob_tag` (`admin_veh_mob_tag_veh_no`, `admin_veh_mob_tag_mob_no`, `admin_veh_mob_tag_mob_model`, `admin_veh_mob_tag_imei_no`, `admin_veh_mob_tag_os`, `admin_veh_mob_tag_cr_dt`, `admin_veh_mob_tag_mod_dt`, `admin_veh_mob_tag_status`, `admin_id`,`remarks`) VALUES (?,?,?,?,?,?,?,?,?,?)';
    var values = [vehNo, mobileNum, model, imei, os, new Date(), new Date(), 'a', userId, remarks];
    var result = await this.db.query(sql, values);
    console.log(result)
    return `Mobile tagged with Vehicle Successfully with ID: ${result.insertId}`;
  };

  async updateTag(inputId, input) {
    const id = parseInt(inputId)
    const { vehNo, mobileNum, remarks } = input

    await this.db.query(
      'UPDATE admin_veh_mob_tag SET admin_veh_mob_tag_veh_no = ?,admin_veh_mob_tag_mob_no=?, remarks=?, admin_veh_mob_tag_mod_dt = SYSDATE() WHERE admin_veh_mob_tag_id = ?',
      [vehNo, mobileNum, remarks, id]);
    return `Trip modified with ID: ${id}`;
  };

  async getUserTypes(input) {
    var result = await this.db.query('select web_user_type_id as userTypeId, user_type as userType, user_type_code as userTypeCode from web_user_type ');
    return result;
  }

  async getMasterUsers(input) {
    var result = await this.db.query('select wdm_id as masterId,wdm_Dname as name, wdm_Ecode as eCode from web_driver_master ');
    return result;
  }

  async getUsers(input) {
    var result = await this.db.query('SELECT user_id,name,web_user_key_id as user_key_id,web_user_type_id as user_type_id,status,user_type_code,system_user_id, password FROM web_user ');
    return result;
  }

  async getUsersActive(input) {
    var result = await this.db.query('SELECT user_id,name,web_user_key_id as user_key_id,web_user_type_id as user_type_id,status,user_type_code,system_user_id, password FROM web_user where status="a" ');
    return result;
  }

  async getUsersById(inputId) {
    const { id } = inputId;
    var result = await this.db.query('SELECT user_id,name,web_user_key_id as user_key_id,web_user_type_id as user_type_id,status,user_type_code,system_user_id, password FROM web_user where user_id=?', [id]);
    return result;
  }

  async createUser(createdBy, input) {
    const { name, phone, userType, eCode } = input;
    var user_id = parseInt(phone);
    var usersArray = await this.userService.findWebUser(user_id);
    if (usersArray.length > 0) {
      TE('Mobile No. already exists');
    }

    usersArray = await this.userService.findUserBySystemUserId(eCode);
    if (usersArray.length > 0) {
      TE('User already exists with the Employee ID');
    }

    /**Deactivating existing systemuserId values 
    var updateStatus=await this.db.query(
      'UPDATE web_user SET status = ?, modified_dt=now() WHERE system_user_id = ?',
      ['i', eCode]);*/

    var sql = 'INSERT INTO `web_user` (`user_id`,`name`,`created_dt`,`modified_dt`,`password`,`password_dt`,`password_ch_dt`,`status`,`web_user_type_id`,`user_type_code`,`created_user`,`system_user_id`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    var values = [user_id, name, new Date(), new Date(), encryptUtil.encrypt('test1234'), new Date(), new Date(), 'a', parseInt(userType), parseInt(userType) * 10, createdBy, eCode];
    var result = await this.db.query(sql, values);
    console.log(result);
    return { userId: phone, msg: `User added with ID: ` + phone };
  }

  async updateUser(input) {
    //const id = inputId;
    const { name, phone, userType, eCode } = input;

    await this.db.query(
      'UPDATE web_user SET name = ?, user_id = ?, web_user_type_id=?,user_type_code=?,modified_dt=now() WHERE system_user_id = ? and status = ?', [name, phone, userType, parseInt(userType) * 10, eCode, 'a']);
    return `User modified with ID: ${eCode}`;
  }

}

module.exports = AdminService;