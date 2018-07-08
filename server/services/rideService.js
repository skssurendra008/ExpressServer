
var dbUtil = require('../utility/ess_DBUtilConn');
var postRideDetails = require('../model/postRideDetails');
var bookRideDetails = require('../model/bookRideDetails');

// run everyday at midnight 
/** 1. By Node Scheduler **/
var schedule = require('node-schedule');
schedule.scheduleJob('0 0 * * *', () => { 
    console.log("Schedule Started");
    dbUtil.delete(postRideDetails, function(err, data){});
    dbUtil.delete(bookRideDetails, function(err, data){});
});

/** 2. By setInterval **/
// var myInt = setInterval(function () {
//     console.log("SetInterval Started");
//     dbUtil.delete(postRideDetails, function(err, data){});
//     dbUtil.delete(bookRideDetails, function(err, data){});
// }, 86400000);
//myInt.clearInterval();	// Cancels an Interval object


exports.postRide = function(userDeatils, callback) {
    console.log("inside postRide method");
    dbUtil.insertUser(postRideDetails, userDeatils, callback);
}

exports.getAllRide = function(userDeatils, callback) {
    console.log("inside getAllRide method");
    dbUtil.getAll(postRideDetails, userDeatils, callback);
}

exports.verifyBookedRide = function(userDeatils, callback) {
    console.log("inside verifyBookedRide method");
    dbUtil.getAll(bookRideDetails, userDeatils, callback);
}

exports.bookRide = function(userDeatils, callback) {
    console.log("inside bookRide method");
    dbUtil.insertUser(bookRideDetails, userDeatils, callback);
}

exports.getMyBookedRide = function(userDeatils, callback) {
    console.log("inside getMyBookedRide method", userDeatils);
    // console.log(userDeatils.findWithManyIds);
    if (userDeatils.findWithManyIds == true) {
        console.log("Filter with multiple Ids");
       dbUtil.getAll(bookRideDetails, { uniqueRideName: { $in: userDeatils.uniqueRideName}}, callback);
    }
    else {
        console.log("Filter with Single Id");
        dbUtil.getAll(bookRideDetails, userDeatils, callback);
    }
}

exports.updateRideDetails = function(rideDeatils,callback) {
    console.log("inside updateUserDetails method");
    dbUtil.updateRideDetails(postRideDetails,rideDeatils,callback);
}

exports.updateRideDetailsAfterReject = function(rideDeatils,callback) {
    console.log("inside updateRideDetailsAfterReject  method");
    dbUtil.updateRideDetailsAfterReject(postRideDetails,rideDeatils,callback);
}

exports.updateRideStatusInBookingTable = function(rideDeatils,callback) {
    console.log("inside updateRideStatusInBookingTable method");
    dbUtil.updateRideStatusInBookingTable(bookRideDetails,rideDeatils,callback);
}

exports.deleteRide = function(rideDeatils,callback) {
    console.log("inside deleteRide method");
    dbUtil.deleteTable(postRideDetails,rideDeatils,callback);
}

exports.deleteBookedRide = function(rideDeatils, callback) {
    console.log("inside deleteBookings method");
    dbUtil.deleteTable(bookRideDetails, rideDeatils, callback);
}
// exports.updateRideStatusInRideTable = function(rideDeatils,callback) {
//     console.log("inside updateRideStatusInRideTable method");
//     dbUtil.updateRideStatusInRideTable(bookRideDetails,rideDeatils,callback);
// }


/** Email Sending **/
var nodemailer = require("nodemailer");
exports.sendEmail = function(emailtype, data) {
    console.log("Send email = ", data);
    var smtpTransport = nodemailer.createTransport({
		service: 'gmail',
		// host: 'smtp.gmail.com',
		port: 587,
		secure: true, // false,
		auth: {
			user: 'noreply.jrides@gmail.com',
			pass: 'Abcd@1234'
		},
		tls: {rejectUnauthorized: false}
	});

    var htmlMessage ;
    var sendemailto ;
    var emailSubject ;
    if(emailtype == 'bookRide') {
        var bookingRidehtml = "Hi "+data.rideownerUsername+", <br><br> There was a booking request for the ride you posted. Below are the details: <br>"+ 
        "<b>Name:</b> "+data.myusername+"<br>"+
        "<b>Email:</b> "+data.email+"<br>"+
        "<b>Mobile Number:</b> "+data.mobileNumber+"<br>"+
        "<b>Drop Location:</b> "+data.destination+"<br><br>"+
        "Please <b>Accept/Reject</b> ride in your <b>Offered Rides</b> tab for your convenience.<br><br>"+
        "Happy Riding !<br>"+
        "<b>Thanks,</b><br>"+
        "JRides Team.";
        htmlMessage = bookingRidehtml;
        sendemailto = data.rideownerEmail;
        emailSubject = "Booking Request";
    } else if (emailtype == 'accept') {
        var acceptRidehtml = "Hi "+data.myusername+", <br><br> Your booking request was <b> Accepted </b>. Below are the Owner details : <br>"+ 
        "<b>Name:</b> "+data.username+"<br>"+
        "<b>Email:</b> "+data.rideownerEmail+"<br>"+
        "<b>Mobile Number:</b> "+data.rideownerMobileNumber+"<br><br>"+
        "<b>You can also check the Vehicle Owner detail in 'Booked Rides' tab of the App.</b><br><br>"+
        // "<b>Drop Location:</b> "+Baner+"<br><br>"+
        "Happy Riding !<br>"+
        "<b>Thanks,</b><br>"+
        "JRides Team."
        htmlMessage = acceptRidehtml;
        sendemailto = data.email;
        emailSubject = "Booking Request Accepted";
    } else if (emailtype == 'cancel') {
        var rejectRidehtml = "Hi "+data.username+", <br><br> Booking was <b> Cancelled </b> by the user due to some reason. Below are the user details : <br>"+ 
        "<b>Name:</b> "+data.myusername+"<br>"+
        "<b>Email:</b> "+data.email+"<br><br>"+
        "Happy Riding !<br>"+
        "<b>Thanks,</b><br>"+
        "JRides Team."
        htmlMessage = rejectRidehtml;
        sendemailto = data.rideownerEmail;
        emailSubject = "Booking Request Cancelled";
    } else if (emailtype == 'canceltrip') {
        var rejectRidehtml = "Hi "+data.myusername+", <br><br> This trip has been <b> Cancelled </b> by the user due to some reason. Please book another ride. <br><br>"+ 
        "Happy Riding !<br>"+
        "<b>Thanks,</b><br>"+
        "JRides Team."
        htmlMessage = rejectRidehtml;
        sendemailto = data.email;
        emailSubject = "Trip Cancelled";
    } else {
        var rejectRidehtml = "Hi "+data.myusername+", <br><br> Your booking request was <b> Rejected </b> due to some reason. Please booking another ride. <br><br>"+ 
        "Happy Riding !<br>"+
        "<b>Thanks,</b><br>"+
        "JRides Team."
        htmlMessage = rejectRidehtml;
        sendemailto = data.email;
        emailSubject = "Booking Request Rejected";
    }

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: '"JRide Team" <noreply.jrides@gmail.com>', // sender address
		to: sendemailto, // list of receivers
		subject: emailSubject, // Subject line
		// text: "Hello world ", // plaintext body
		html:  htmlMessage// html body
	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
		}else{
			console.log("Message sent: " + response);
		}
	});
}