
var express = require('express');
const jwt = require('jsonwebtoken');

var rideService = require('../services/rideService'); //import ride service
var loginService = require('../services/loginService'); //import login service

// To post new Ride
exports.postRide = function(req, res, next) {
    console.log("Inside Server postRide Controller",req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.postRide(req.body, function(err, data) {
                if(err != null) {
                    console.log("Post Ride Error",err);
                    let response = { message:"This Useremail has already taken.", success:true };
                    if(err.errmsg.indexOf("user_username") > -1) {
                        response.message = "This Username has already taken."
                    }
                    res.send(JSON.stringify(response));
                }
                else {
                    let response = { message:"Ride Posted Successfully. Please Accept/Reject ride in your 'Posted Rides' tab after booking happened.", success:true };
                    res.send(JSON.stringify(response));
                }
            });
        }
    });
}

// To get AllRide
exports.getAllRide = function(req, res, next) {
    console.log("Inside Server getAllRide Controller",req.body);
    if(req.body.rideownerUsername) {
        rideService.getAllRide( {$and: [{"departureTime": {$gte: new Date()}}, {"rideownerUsername":{$ne: req.body.rideownerUsername}}] }, function(err, data){
            console.log("getAllRide Error",err);
    
            if(err != null) {
                // res.send(JSON.stringify(err));
                let response = { message:"This Useremail has already taken.", success:true };
                if(err.errmsg.indexOf("user_username") > -1) {
                    response.message = "This Username has already taken."
                }
                res.send(JSON.stringify(response));
            }
            else {
                // let response = { message:"Ride Posted Successfully.", success:true };
                console.log(data);
                res.send(JSON.stringify(data));
            }
        });
    }
    else {
        // console.log("Date");
        // console.log(new Date());
        rideService.getAllRide({"departureTime": {$gte: new Date()}}, function(err, data){
            console.log("getAllRide Error",err);
            if(err != null) {
                // res.send(JSON.stringify(err));
                let response = { message:"This Useremail has already taken.", success:true };
                if(err.errmsg.indexOf("user_username") > -1) {
                    response.message = "This Username has already taken."
                }
                res.send(JSON.stringify(response));
            }
            else {
                // console.log(data);
                res.send(JSON.stringify(data));
            }
        });
    }

}

// to get myPostedRides
exports.myPostedRides = function(req, res, next) {
    console.log("Inside Server myPostedRides Controller", req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.getAllRide(req.body, function(err, data){
                if(err != null) {
                    // console.log("myPostedRides Error",err);
                    let response = { message:"This Useremail has already taken.", success:true };
                    if(err.errmsg.indexOf("user_username") > -1) {
                        response.message = "This Username has already taken."
                    }
                    res.send(JSON.stringify(response));
                }
                else {
                    res.send(JSON.stringify(data));
                }
            });
        }
    });
}

// To book new Ride
exports.bookRide = function(req, res, next) {
    console.log("Inside Server bookRide Controller",req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.getAllRide({"_id": req.body.rideId}, function(err, data){
                console.log("getAllRide Error",err);
                if(err != null) {
                    // res.send(JSON.stringify(err));
                    let response = { message:"Something went wrong.", success:false };
                    res.send(JSON.stringify(response));
                }
                else {
                    /** Check if seat is available **/
                    if(req.body.bookedSeats > data[0].availableSeats) {
                        let response = { message: data[0].availableSeats+" Seat(s) is Available.", success:false };
                        res.send(JSON.stringify(response));
                    }
                    else { /** Check is You have already booked this Ride **/
                        rideService.verifyBookedRide({"uniqueRideName": req.body.uniqueRideName}, function(err, data){
                            console.log("verifyBookedRide Error", err);
                            console.log("verifyBookedRide Data", data);
                            if(err != null) {
                                let response = { message:"Something went wrong.", success:false };
                                res.send(JSON.stringify(response));
                            }
                            else {
                                if(data != null && data != "" && data[0].uniqueRideName == req.body.uniqueRideName) {
                                    let response = { message:"You have already booked this Ride.", success:false };
                                    res.send(JSON.stringify(response));
                                }
                                else { /** Add booking in the booking table **/
                                    rideService.bookRide(req.body, function(err, data){
                                        console.log("Book Ride Error",err);
                                        console.log("Book Ride Data",data);
                                        if(err != null) {
                                            let response = { message:"Something went wrong.", success:false };
                                            res.send(JSON.stringify(response));
                                        }
                                        else {
                                            /********* Now update this booking in Ride Table **********/
                                            /** 1. Reduce/Update the availableSeats from AllRides table **/
                                            /** 2. Add add booking in bookings array of AllRides table **/
                                            rideService.updateRideDetails(req.body,function(err,data){
                                                console.log("updateRideDetails Error", err);
                                                // console.log("updateRideDetails Response", data);
                                                if(err) {
                                                    /** 1. delete the booked ride **/
                    
                    
                                                    /** 2. Send response to the User **/
                                                    let response = { message : "Something went wrong.", success : false };
                                                    res.send(JSON.stringify(response));
                                                }
                                                else {
                                                    let response = { message : "Ride Booked Successfully. Please check your Booking Status in 'My Booking' tab.", success : true };
                                                    res.send(JSON.stringify(response));

                                                    /** Sending email to the owner of the vehicle**/
                                                    rideService.sendEmail("bookRide", req.body);

                                                    /** Sending notification to the owner of the vehicle **/
                                                    let title = "Booking Request";
                                                    let message = "Please Accept/Reject Ride from 'Posted Rides' tab.";
                                                    this.sendNotification(req.body.rideownerUsername, title, req.body.rideId, message);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}

// to get myBookedRide
exports.myBookedRide = function(req, res, next) {
    console.log("Inside Server myBookedRide Controller", req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.getMyBookedRide(req.body, function(err, data) {
                if(err != null) {
                    // console.log("myBookedRide Error", err);
                    let response = { message : "Something went wrong.", success : false };
                    res.send(JSON.stringify(response));
                }
                else {
                    // console.log("BookedRide Data", data);
                    let response = { success : true, data: data};
                    res.send(JSON.stringify(response));
                }
            });
        }
    });
}

// To updateRideStatus
exports.updateRideStatus = function(req, res, next) {
    console.log("Inside Server updateRideStatus Controller", req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.updateRideStatusInBookingTable(req.body,function(err,data) {
                if(err) {
                    // console.log("Error ", err);
                    let response = { message : "Something went wrong.", success : false };
                    res.send(JSON.stringify(response));
                }
                else {
                    // console.log("responce",data);
                    if(req.body.bookingStatus == "Reject") {
                        /** Update the availableSeats now in Ride Table  **/
                        rideService.updateRideDetailsAfterReject(req.body,function(err, data) {
                            if(err) {
                                // console.log(err);
                                let response = { message : "Something went wrong.", success : false };
                                res.send(JSON.stringify(response));
                            }
                            else {
                                let response = { message:"Booking Reject Successfully.", success:true };
                                res.send(JSON.stringify(response));

                                /** Sending email to the ride booked user **/
                                rideService.sendEmail("reject", req.body);

                                /** Sending notification to the ride booked user **/
                                let rideTitle = "Booking Request Rejected";
                                let message = "Please book another ride from 'Rides' tab.";
                                let rideId = req.body.uniqueRideName; /** uniqueRideName booking table **/
                                this.sendNotification(req.body.myusername, rideTitle, rideId, message);
                            }
                        });
                    }
                    else {
                        let response = { message:"Booking Accepted Successfully.", success:true };
                        res.send(JSON.stringify(response));
                        
                        /** Sending email to the ride booked user **/
                        rideService.sendEmail("accept", req.body);

                        /** Sending notification to the ride booked user **/
                        let rideTitle = "Booking Request Accepted";
                        let message = "Please check 'My Bookings' tab for more details.";
                        let rideId = req.body.uniqueRideName; /** uniqueRideName booking table **/
                        this.sendNotification(req.body.myusername, rideTitle, rideId, message);
                    }
                }
            });
        }
    });
}


sendNotification = function(username, rideTitle, rideId, userMessage) {
    /** Getting the device details of the user **/
    loginService.getRegisterUserDevice({"deviceUsername" : username}, function(err,data){
        console.log("getRegisterUserDevice Error", err);      
        console.log("getRegisterUserDevice Responce", data);
        if(err != null) {
            // res.send(JSON.stringify(err));
            let response = { message:"Something went wrong. Please try again later.", success:false };
            res.send(JSON.stringify(response));
        }
        else {
            if(data != null && data != "") {
                let title = rideTitle;
                let message = userMessage;
                if (data[0].devicePlatform == "Android") {
                    this.sendNotificationToAndroid(data[0].deviceRegisteredId, title, rideId, message);
                }
                else {  }
            }
        }
    });
}



// Send Notification to the Android user
var FCM = require('fcm-node');
var SERVER_API_KEY='AAAAzmkEHgY:APA91bGbOCPYlKduXCMEkGr-nJbsZYWOpzzIzOWo9hpNYCdUAfywq0zcCHD_nAWZsVr6zquaEKsSFzqhUKIr_CHX1S52tBa5yKLoLtmjPN6GfDCE3BOh87HOkEizxfUkZzdeEyPnFDcF0kdo-7Rqd7YSNAIOBCMmEg';//put your api key here
// var validDeviceRegistrationToken = 'eDAH0FeQ01M:APA91bFiGJsi1wYvRMd-wJSim2CeOqVKLQHkuiYwXZqugV0p4R8lC3TSrKmkq1_kiSFOeM81Nx5KrorKhlpWNiwx6Jm73zsN6clHwsti80KCDzFbZl-m_w-SwGdyEUSZxxNDBBVm3hXi6HkiPY8H3faYDR5m4ca4_Q'; //put a valid device token here
var fcmCli = new FCM(SERVER_API_KEY);

// var payloadOK = {
//     to: validDeviceRegistrationToken,
//     data: { //some data object (optional)
//         url: 'news',
//         foo:'fooooooooooooo',
//         bar:'bar bar bar'
//     },
//     priority: 'high',
//     content_available: true,
//     notification: { //notification object
//         title: 'Suri', body: 'World!', sound : "default", badge: "1"
//     }
// };

// var payloadMulticast = {
//     registration_ids:["4564654654654654",
//         '123123123',
//         validDeviceRegistrationToken, //valid token among invalid tokens to see the error and ok response
//         '123133213123123'],
//     data: {
//         url: "news"
//     },
//     priority: 'high',
//     content_available: true,
//     notification: { title: 'Suri', body: 'Multicast', sound : "default", badge: "1" }
// };

var callbackLog = function (sender, err, res) {
    console.log("\n__________________________________")
    console.log("\t"+sender);
    console.log("----------------------------------")
    console.log("err="+err);
    console.log("res="+res);
    console.log("----------------------------------\n>>>");
};

sendNotificationToAndroid = function (validDeviceRegistrationToken, rideTitle, rideId, message) {
    // fcmCli.send(payloadOK, function(err, res){
    //     callbackLog('sendOK', err, res);
    // });
    fcmCli.send( {
        to: validDeviceRegistrationToken,
        data: { //some data object (optional)
            url: 'news',
            foo:'fooooooooooooo',
            bar:'bar bar bar',
            rideTitle: rideTitle,
            rideId: rideId
        },
        priority: 'high',
        content_available: true,
        notification: { //notification object
            title : rideTitle, body : message, sound : "default", badge: "1"
        }
    }, function(err, res){
        callbackLog('sendNotification', err, res);
    });
}
