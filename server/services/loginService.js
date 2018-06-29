
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
    // let updatedDetails = {};
    updatedDetails['deviceRegisteredId'] = userDeatils.deviceRegisteredId;
    console.log(updatedDetails);

    let updateWith = {};
    updateWith['deviceUsername'] = userDeatils.deviceUsername;
    // console.log(updateWith);
    dbUtil.updateDetails(userDeviceDetails, updateWith, userDeatils,callback);
}

   