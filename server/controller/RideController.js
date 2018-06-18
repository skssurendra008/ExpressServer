
var express = require('express');

//import service folder
var rideService = require('../services/rideService');

// To post new Ride
exports.postRide = function(req, res, next) {
    console.log("Inside Server postRide Controller",req.body);
    rideService.postRide(req.body, function(err, data){
        console.log("Post Ride Error",err);

        if(err != null) {
            // res.send(JSON.stringify(err));
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

// To get AllRide
exports.getAllRide = function(req, res, next) {
    console.log("Inside Server getAllRide Controller",req.body);
    if(req.body.username) {
        rideService.getAllRide( {$and: [{"departureTime": {$gte: new Date()}}, {"username":{$ne: req.body.username}}] }, function(err, data){
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
    console.log("Inside Server myPostedRides Controller",req.body);
    rideService.getAllRide(req.body, function(err, data){
        console.log("myPostedRides Error",err);
        if(err != null) {
            // res.send(JSON.stringify(err));
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

// To book new Ride
exports.bookRide = function(req, res, next) {
    console.log("Inside Server bookRide Controller",req.body);
    rideService.getAllRide({"_id": req.body.rideId}, function(err, data){
        console.log("getAllRide Error",err);

        if(err != null) {
            // res.send(JSON.stringify(err));
            let response = { message:"Something went wrong.", success:false };
            res.send(JSON.stringify(response));
        }
        else {
            if(req.body.bookedSeats > data[0].availableSeats) {
                let response = { message: data[0].availableSeats+" Seat(s) is Available.", success:false };
                res.send(JSON.stringify(response));
            }
            else {

                rideService.verifyBookedRide({"uniqueRideName": req.body.uniqueRideName}, function(err, data){
                    console.log("verifyBookedRide Error",err);
                    console.log("verifyBookedRide Data",data);
                    if(err != null) {
                        let response = { message:"Something went wrong.", success:false };
                        res.send(JSON.stringify(response));
                    }
                    else {
                        if(data != null && data != "" && data[0].uniqueRideName == req.body.uniqueRideName) {
                            let response = { message:"You have already booked this Ride.", success:false };
                            res.send(JSON.stringify(response));
                        }
                        else {
                            rideService.bookRide(req.body, function(err, data){
                                console.log("Book Ride Error",err);
                                console.log("Book Ride Data",data);
            
                                if(err != null) {
                                    let response = { message:"Something went wrong.", success:false };
                                    res.send(JSON.stringify(response));
                                }
                                else {
                                    /********* Now update this booking in Ride Table **********/
                                    /** 1. Reduce/Update the availableSeats from AllRides **/
                                    /** 2. Add then booking in bookings array **/
                                    rideService.updateRideDetails(req.body,function(err,data){
                                        console.log("updateRideDetails Error",err);
                                        // console.log("updateRideDetails Error",data);
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

// to get myBookedRide
exports.myBookedRide = function(req, res, next) {
    console.log("Inside Server myBookedRide Controller",req.body);
    rideService.getMyBookedRide(req.body, function(err, data){
        console.log("myBookedRide Error",err);
        if(err != null) {
            // res.send(JSON.stringify(err));
            let response = { message : "Something went wrong.", success : false };
            res.send(JSON.stringify(response));
        }
        else {
            console.log(" BookedRide Data");
            console.log(data);
            let response = { success : true, data: data};
            res.send(JSON.stringify(response));
        }
    });
}

// To updateRideStatus
exports.updateRideStatus = function(req, res, next) {
    console.log("Inside Server updateRideStatus Controller",req.body);
    rideService.updateRideStatusInBookingTable(req.body,function(err,data){
        console.log(err);
        // console.log("responce",data);
        if(err) {
            // res.send("invalid user"+JSON.stringify(err));
            let response = { message : "Something went wrong.", success : false };
            res.send(JSON.stringify(response));
        }
        else {
            if(req.body.bookingStatus == "Reject") {
                /** Update the availableSeats now in Ride Table  **/
                rideService.updateRideDetailsAfterReject(req.body,function(err,data){
                    console.log(err);
                    if(err) {
                        let response = { message : "Something went wrong.", success : false };
                        res.send(JSON.stringify(response));
                    }
                    else {
                        let response = { message:"Booking Reject Successfully.", success:true };
                        res.send(JSON.stringify(response));

                        /** Sending email to the ride booked user **/
                        rideService.sendEmail("reject", req.body);
                    }
                });
            }
            else {
                let response = { message:"Booking Accepted Successfully.", success:true };
                res.send(JSON.stringify(response));

                
                /** Sending email to the ride booked user **/
                rideService.sendEmail("accept", req.body);
            }
        }
    });
}
