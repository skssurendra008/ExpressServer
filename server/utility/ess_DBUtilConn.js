var mongoose = require("mongoose");

var con = require("../config/ess_dbConnection");
/**
* Method:GetAll(Table, queryParam, callback)
* Table: Name of Schema 
* QueryParam:Required input get all data,similar to select all in RDBMS
* Designed By: Adish Upadhyay
* @method getAll
* @param {} Table
* @param {} queryParam
* @param {} callback
* @return 
*/
exports.getAll = function(Table, queryParam, callback) {
    console.log("inside getAll method");
    Table.find(queryParam, function(err, doc) {
        callback(err,doc);
    });
};

exports.insertUser = function(Table, queryParam, callback) {
    console.log("Inside DBUtilConn insertUser method",queryParam);
    var Table = new Table(queryParam);  // Need to create Table Object in case of insert data in DB
    Table.save(function(err, doc) {
        callback(err,doc);
    });
};

exports.updateUserDetails = function(Table, queryParam, callback) {
    console.log("Inside DBUtilConn updateUserDetails method");
    let updatedDetails = {};
    updatedDetails[queryParam.user_updatedetail] = queryParam.user_updatedetailvalue;
    console.log(updatedDetails);
    Table.update({'user_username': queryParam.user_username}, updatedDetails, function(err, doc){
        callback(err,doc);
    });
    // Table.update({_id: ("5a854ed5e28f5f44e4aff123")}, queryParam, {upsert: true}, function(err, doc) {
	//     callback(err, doc);
    // });
}

exports.updateDetails = function(Table, updateWith, updatedDetails, callback) {
    console.log("Inside DBUtilConn updateDetails method");
    Table.update(updateWith, updatedDetails, function(err, doc){
        callback(err,doc);
    });
}
 
exports.updateRideDetails = function(Table, queryParam, callback) {
    console.log("Inside DBUtilConn updateRideDetails method");
    let seats = queryParam.availableSeats-queryParam.bookedSeats;
    
    Table.update({'_id': queryParam.rideId},  { $set: {availableSeats: seats}, $push: { bookings: queryParam.uniqueRideName } }, function(err, doc){
        callback(err,doc);
    });
}

exports.updateRideDetailsAfterReject = function(Table, queryParam, callback) {
    console.log("Inside DBUtilConn updateRideDetailsAfterReject method");
    // console.log(queryParam);

    Table.update({'_id': queryParam._id},  { $set: {availableSeats: queryParam.updatedSeats}, $pull: { bookings: queryParam.uniqueRideName } }, function(err, doc){
        callback(err,doc);
    });
}

exports.updateRideStatusInBookingTable = function(Table, queryParam, callback) {
    console.log("Inside DBUtilConn updateRideStatusInBookingTable method", queryParam);
    let updatedDetails = {};
    updatedDetails['bookingStatus'] = queryParam.bookingStatus;
    console.log(updatedDetails);
    Table.update({'uniqueRideName': queryParam.uniqueRideName}, updatedDetails, function(err, doc){
        callback(err,doc);
    });
}

exports.deleteTable = function(Table, queryParam, callback) {
    Table.remove({"_id" : queryParam._id}, function(err, doc) {
        callback(err, doc);
    });
}

exports.delete = function(Table, callback) {
    var newDate = new Date();
    newDate.setDate(newDate.getDate()-6);
    // console.log(newDate);
    Table.remove({"departureTime": {$lt: newDate}}, function(err, doc) {
        callback(err, doc);
    });
}

