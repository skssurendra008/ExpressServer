
var express = require('express');
const jwt = require('jsonwebtoken');

var moment = require('moment');

var rideService = require('../services/rideService'); //import ride service
var loginService = require('../services/loginService'); //import login service

// To post new Ride
exports.postRide = function(req, res, next) {
    console.log("Inside Server postRide Controller" , req.body);
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            let start = moment.utc(req.body.departureTime);
            let end = moment.utc(req.body.departureEndDate);
            let count = end.diff(start, 'days');
            // console.log("Count is "+ count);

            for(let i=0; i<= count; i++) {
                // console.log(req.body.departureTime);
                if(moment.utc(req.body.departureTime).day() == "0" || moment.utc(req.body.departureTime).day() == "6") {
                    req.body.departureTime = moment.utc(req.body.departureTime).add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ');
                } else {
                    // insert Data into DB;
                    rideService.postRide(req.body, function(err, data) {
                        if(err != null) {
                            let response = { message:"Something went wrong. Please try again later.", success:false };
                            res.send(JSON.stringify(response));
                            return;
                        }
                        // else {
                        //     if(i == count ) {
                        //         let response = { message:"You have offered a ride, please check 'Offered Rides' to Accept/Reject bookings.", success:true };
                        //         res.send(JSON.stringify(response));
                        //     }
                        // }
                    });
                    req.body.departureTime = moment.utc(req.body.departureTime).add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ'); 
                }

                if(i == count ) {
                    let response = { message:"You have offered rides, please check 'Offered Rides' to Accept/Reject bookings.", success:true };
                    res.send(JSON.stringify(response));
                }
                
            }
        }
    });
}

// To get AllRide
exports.getAllRide = function(req, res, next) {
    console.log("Inside Server getAllRide Controller");
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            var start = moment.utc().startOf('day'); // set to 12:00 am today
            var end = moment.utc().endOf('day'); // set to 23:59 pm today

            if(req.body.rideownerUsername) {
                rideService.getAllRide( {$and: [{"departureTime": {$gte: start}}, {"departureTime": {$lt: end}} , {"availableSeats": {$gt: 0}}, {"rideownerUsername":{$ne: req.body.rideownerUsername}}] }, function(err, data){
                    if(err != null) {
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
            else {
                rideService.getAllRide( {$and: [{"departureTime": {$gte: start}}, {"departureTime": {$lt: end}} , {"availableSeats": {$gt: 0}}] }, function(err, data){
                    if(err != null) {
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
        }
    });
}

// to get myPostedRides
exports.myPostedRides = function(req, res, next) {
    console.log("Inside Server myPostedRides Controller");
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.getAllRide(req.body, function(err, data){
                if(err != null) {
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
    console.log("Inside Server bookRide Controller");
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.getAllRide({"_id": req.body.rideId}, function(err, data){
                if(err != null) {
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
                            if(err != null) {
                                let response = { message:"Something went wrong. Please try again later.", success:false };
                                res.send(JSON.stringify(response));
                            }
                            else {
                                if(data != null && data != "" && data[0].uniqueRideName == req.body.uniqueRideName) {
                                    let response = { message:"You have already booked this Ride.", success:false };
                                    res.send(JSON.stringify(response));
                                }
                                else { /** Add booking in the booking table **/
                                    rideService.bookRide(req.body, function(err, data){
                                        if(err != null) {
                                            let response = { message:"Something went wrong. Please try again later.", success:false };
                                            res.send(JSON.stringify(response));
                                        }
                                        else {
                                            /********* Now update this booking in Ride Table **********/
                                            /** 1. Reduce/Update the availableSeats from AllRides table **/
                                            /** 2. Add booking in bookings array of AllRides table **/
                                            rideService.updateRideDetails(req.body,function(updaterideerr, updateridedata){
                                                // console.log("updateRideDetails Error", updaterideerr);
                                                if(updaterideerr) {
                                                    /** 1. delete the booked ride from 'bookedRideDetails' table **/
                                                    rideService.deleteBookedRide(data._id, function(err,data) {
                                                        if(err) { }
                                                        else { }
                                                    });
                    
                                                    /** 2. Send response to the User **/
                                                    let response = { message : "Something went wrong. Please try again later.", success : false };
                                                    res.send(JSON.stringify(response));
                                                }
                                                else {
                                                    let response = { message : "The ride has been booked, please check your Booking Status in 'Booked Rides' tab.", success : true };
                                                    res.send(JSON.stringify(response));

                                                    /** Sending email to the owner of the vehicle**/
                                                    rideService.sendEmail("bookRide", req.body);

                                                    /** Sending notification to the owner of the vehicle **/
                                                    let title = "Booking Request";
                                                    let message = "Please Accept/Reject Ride from 'Offered Rides' tab.";
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
    console.log("Inside Server myBookedRide Controller");
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.getMyBookedRide(req.body, function(err, data) {
                if(err != null) {
                    let response = { message : "Something went wrong. Please try again later.", success : false };
                    res.send(JSON.stringify(response));
                }
                else {
                    let response = { success : true, data: data};
                    res.send(JSON.stringify(response));
                }
            });
        }
    });
}


// To cancelTrip
exports.cancelTrip = function(req, res, next) {
    console.log("Inside Server cancelTrip Controller");
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            if(req.body.bookings) {
                /** 1. Update the status of all booking table **/
                var allBookings = req.body.bookings;
                for(let x=0; x<allBookings.length; x++) {
                    let bookingStatusDetails = {};
                    bookingStatusDetails.uniqueRideName = allBookings[x].uniqueRideName;
                    bookingStatusDetails.bookingStatus = "Cancel Trip";
                    rideService.updateRideStatusInBookingTable(bookingStatusDetails, function(err, data) {
                        if(err) {
                            let response = { message : "Something went wrong. Please try again later.", success : false };
                            res.send(JSON.stringify(response));
                        }
                        else {
                            // /** Sending email to the ride booked user **/
                            var modefiedDepartureTime = allBookings[x].departureTime.split("T");
                            var modefiedDepartureTime2 = modefiedDepartureTime[1].substring(0, 5);
                            allBookings[x].departureTime = modefiedDepartureTime[0] + "," +modefiedDepartureTime2;
                            rideService.sendEmail("canceltrip", allBookings[x]);

                            /** Sending notification to the ride booked user **/
                            let rideTitle = "Trip Cancelled";
                            let message = "Please book another ride from 'Rides' tab.";
                            let rideId = allBookings[x].uniqueRideName; /** uniqueRideName booking table **/
                            this.sendNotification(allBookings[x].myusername, rideTitle, rideId, message);
                        }
                    });
                }
                /** 2. delete the Ride **/
                rideService.deleteRide(req.body, function(err,data) {
                    if(err) {
                        let response = { message : "Something went wrong. Please try again later.", success : false };
                        res.send(JSON.stringify(response));
                    }
                    else {
                        let response = { message:"Your trip has been cancelled.", success:true };
                        res.send(JSON.stringify(response));
                    }
                });
            } else {
                /** delete the Ride **/
                rideService.deleteRide(req.body, function(err, data) {
                    if(err) {
                        let response = { message : "Something went wrong.", success : false };
                        res.send(JSON.stringify(response));
                    }
                    else {
                        let response = { message:"Your trip has been cancelled.", success:true };
                        res.send(JSON.stringify(response));
                    }
                });

            }
        }
    });
}


// To updateRideStatus
exports.updateRideStatus = function(req, res, next) {
    console.log("Inside Server updateRideStatus Controller");
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            rideService.updateRideStatusInBookingTable(req.body,function(err,data) {
                if(err) {
                    let response = { message : "Something went wrong. Please try again later.", success : false };
                    res.send(JSON.stringify(response));
                }
                else {
                    if(req.body.bookingStatus == "Reject") {
                        /** Update the availableSeats now in Ride Table  **/
                        rideService.updateRideDetailsAfterReject(req.body, function(err, data) {
                            if(err) {
                                let response = { message : "Something went wrong. Please try again later.", success : false };
                                res.send(JSON.stringify(response));
                            }
                            else {
                                let response = { message:"Booking has been rejected.", success:true };
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
                    else if(req.body.bookingStatus == "Cancel") {
                        /** Update the availableSeats now in Ride Table  **/
                        rideService.updateRideDetailsAfterReject(req.body, function(err, data) {
                            if(err) {
                                let response = { message : "Something went wrong. Please try again later.", success : false };
                                res.send(JSON.stringify(response));
                            }
                            else {
                                let response = { message:"Booking has been cancelled.", success:true };
                                res.send(JSON.stringify(response));

                                /** Sending email to the ride owner user **/
                                rideService.sendEmail("cancel", req.body);

                                /** Sending notification to the ride owner user **/
                                let rideTitle = "Booking Request Cancelled";
                                let message = "Ride has been cancelled by the user.";
                                let rideId = req.body.uniqueRideName; /** uniqueRideName booking table **/
                                this.sendNotification(req.body.username, rideTitle, rideId, message);
                            }
                        });
                    }
                    else {
                        let response = { message:"Booking has been accepted.", success:true };
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
    loginService.getDataFromUserDevicedetailsTable({"deviceUsername" : username}, function(err,data){
        if(err != null) {
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

var callbackLog = function (sender, err, res) {
    console.log("\n__________________________________")
    console.log("\t"+sender);
    console.log("----------------------------------")
    console.log("err="+err);
    console.log("res="+res);
    console.log("----------------------------------\n>>>");
};

sendNotificationToAndroid = function (validDeviceRegistrationToken, rideTitle, rideId, message) {
    fcmCli.send( {
        to: validDeviceRegistrationToken,
        data: { //some data object (optional)
            // url: 'news',
            // foo:'fooooooooooooo',
            // bar:'bar bar bar',
            rideTitle: rideTitle,
            rideId: rideId
        },
        priority: 'high',
        content_available: true,
        notification: { //notification object
            title : rideTitle, body : message, sound : "default", badge: "1", click_action: "FCM_PLUGIN_ACTIVITY"
        }
    }, function(err, res){
        callbackLog('sendNotification', err, res);
    });
}
