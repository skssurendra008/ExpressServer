
var dbUtil = require('../utility/ess_DBUtilConn');
var ess_userdetails = require('../model/userdetails');
var userDeviceDetails = require('../model/userDeviceDetails');

/********************* userdetails Table Operations *********************/
exports.getDataFromUserdetailsTable = function(userDeatils,callback) {
    dbUtil.getAll(ess_userdetails,userDeatils,callback);
}

exports.insertDataInUserdetailsTable = function(userDeatils,callback) {
    dbUtil.insertUser(ess_userdetails,userDeatils,callback);
}

exports.updateUserDetails = function(userDeatils,callback) {
    dbUtil.updateUserDetails(ess_userdetails,userDeatils,callback);
}

exports.updateUsercompleteDetails = function(userDeatils,callback) {
    // console.log("inside updateUsercompleteDetails method");
    let updatedDetails = {};
    updatedDetails['user_type'] = userDeatils.user_type;
    updatedDetails['user_mobile'] = userDeatils.user_type;
    updatedDetails['homeLocation'] = userDeatils.homeLocation;
    updatedDetails['rideRoute'] = userDeatils.rideRoute;
    updatedDetails['vehicleType'] = userDeatils.vehicleType;
    updatedDetails['vehicleName'] = userDeatils.vehicleName;
    updatedDetails['vehicleNumber'] = userDeatils.vehicleNumber;
    updatedDetails['availableSeats'] = userDeatils.availableSeats;
    // console.log(updatedDetails);

    let updateWith = {};
    updateWith['user_username'] = userDeatils.user_username;
    dbUtil.updateDetails(ess_userdetails, updateWith, userDeatils, callback);
}

exports.deleteUser = function(rideDeatils,callback) {
    dbUtil.deleteTable(ess_userdetails, rideDeatils, callback);
}

/********************************************************************************************/



/*************** userDeviceDetails table Operations ************/
exports.getDataFromUserDevicedetailsTable = function(userDeatils,callback) {
    dbUtil.getAll(userDeviceDetails, userDeatils,callback);
}

exports.insertDataInUserDevicedetailsTable = function(userDeatils,callback) {
    dbUtil.insertUser(userDeviceDetails, userDeatils,callback);
}

exports.updateRegisterUserDevice = function(userDeatils,callback) {
    // console.log("inside updateRegisterUserDevice method");
    let updatedDetails = {};
    updatedDetails['deviceRegisteredId'] = userDeatils.deviceRegisteredId;
    // console.log(updatedDetails);

    let updateWith = {};
    updateWith['deviceUsername'] = userDeatils.deviceUsername;
    // console.log(updateWith);
    dbUtil.updateDetails(userDeviceDetails, updateWith, userDeatils,callback);
}

/********************************************************************************************/
