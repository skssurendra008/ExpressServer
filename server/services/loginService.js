
var dbUtil = require('../utility/ess_DBUtilConn');
var ess_userdetails = require('../model/userdetails');

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
