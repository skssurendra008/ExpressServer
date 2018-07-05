
var dbUtil = require('../utility/ess_DBUtilConn');
var ess_userdetails = require('../model/userdetails');
var userDeviceDetails = require('../model/userDeviceDetails');

exports.login = function(userDeatils,callback) {
    console.log("inside login method");
    dbUtil.getAll(ess_userdetails,userDeatils,callback);
}

exports.registerUser = function(userDeatils,callback) {
    console.log("inside registerUser method");
    dbUtil.insertUser(ess_userdetails,userDeatils,callback);
}

exports.updateUserDetails = function(userDeatils,callback) {
    console.log("inside updateUserDetails method");
    dbUtil.updateUserDetails(ess_userdetails,userDeatils,callback);
}

exports.updateUsercompleteDetails = function(userDeatils,callback) {
    console.log("inside updateUsercompleteDetails method");
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

exports.getRegisterUserDevice = function(userDeatils,callback) {
    console.log("inside registerUserDevice method");
    dbUtil.getAll(userDeviceDetails, userDeatils,callback);
}

exports.registerUserDevice = function(userDeatils,callback) {
    console.log("inside registerUserDevice method");
    dbUtil.insertUser(userDeviceDetails, userDeatils,callback);
}

exports.updateRegisterUserDevice = function(userDeatils,callback) {
    console.log("inside updateRegisterUserDevice method");
    let updatedDetails = {};
    updatedDetails['deviceRegisteredId'] = userDeatils.deviceRegisteredId;
    console.log(updatedDetails);

    let updateWith = {};
    updateWith['deviceUsername'] = userDeatils.deviceUsername;
    // console.log(updateWith);
    dbUtil.updateDetails(userDeviceDetails, updateWith, userDeatils,callback);
}

   