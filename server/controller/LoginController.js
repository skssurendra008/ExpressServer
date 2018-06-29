
var express = require('express');
const jwt = require('jsonwebtoken');

//import service folder
var loginService = require('../services/loginService');

// To check user availability while login
exports.login = function(req, res, next) {
    console.log("Inside Server Login Controller",req.body);
    var userDeaits = {"user_username": req.body.user_username};
    //console.log(userDeaits);
    loginService.login(userDeaits, function(err,data){
        console.log("Error ",err);
        console.log("Responce",data);
        if (err) {
            res.send("Invalid user"+JSON.stringify(err));
        }
        else {
            //res.send("Token Session JWT , Success message"+JSON.stringify(data));
            response = { message:"", success:true, userData:"" };
            if(data != null && data != "") {
                var isUserIndex = data.map(function(e) { return e.user_username; }).indexOf(req.body.user_username);
                //console.log("UserName1 = "+data[0].user_username );
               if(data[0].user_username == req.body.user_username) {
                    if(data[0].user_password == req.body.user_password) {
                        response.userData = data[0];
                        response.message = 'User Exists';
                        // res.send(response);

                        /** Sendind response with jwtToken**/
                        jwt.sign({user : req.body}, 'secretkey', (err, token) => {
                            response.jwtToken = token;
                            res.send(response);
                        });
                    } else {
                        response.success = false;
                        response.message = 'Password Mismatch';
                        res.send(response);
                    }
                }
            }
            else {
                response.success = false;
                response.message = 'User do not Exists';
                res.send(response);
            }

        }
    });
}

// To get getUserDetails
exports.getUserDetails = function(req, res, next) {
    console.log("Inside Server Login Controller",req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            loginService.login({"user_username": req.body.user_username}, function(err,data){
                // console.log("Error ",err);
                // console.log("Responce",data);
                if (err) {
                    res.send("Invalid user"+JSON.stringify(err));
                }
                else {
                    response = { message: "", success:true, userData: "" };
                    if(data != null && data != "") {
                        response.userData = data[0];
                        response.message = 'User Exists';
                        res.send(response);
                    }
                    else {
                        response.success = false;
                        response.message = 'User do not Exists';
                        res.send(response);
                    }
                }
            });
        }
    });
}

// To register new user
exports.registerUser = function(req, res, next) {
    console.log("Inside Server registerUser Controller",req.body);
    loginService.registerUser(req.body,function(err,data){
        //console.log("Register User Error",err);      
        //console.log("Register User Responce",data);

        if(err != null) {
            // res.send(JSON.stringify(err));
            let response = { message:"This Useremail has already taken.", success:true };
            if(err.errmsg.indexOf("user_username") > -1) {
                response.message = "This Username has already taken."
            }
            res.send(JSON.stringify(response));
        }
        else {
            let response = { message:"User Created Successfully.", success:true };
            res.send(JSON.stringify(response));
        }
    });
}

// To update user details 
exports.updateUserDetails= function(req, res) {
    console.log("Inside Server updateUserDetails Controller",req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            // console.log("Wrong");
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            loginService.updateUserDetails(req.body, function(err, data){
                console.log(err);
                console.log("responce",data);
                if(err) {
                    let response = { message:"Something went wrong. Please try again later.", success:false };
                        res.send(response);
                }
                else {
                    let response = { message:"Updated Successfully.", success:true };
                    res.send(JSON.stringify(response));
                }
            });
        }
    });
}

// To register/update new user device details
exports.registerUserDevice = function(req, res, next) {
    console.log("Inside Server registerUserDevice Controller",req.body);
    /** Getting the details of the user **/
    loginService.getRegisterUserDevice({"deviceUsername" : req.body.deviceUsername}, function(err,data){
        console.log("getRegisterUserDevice Error",err);          
        console.log("getRegisterUserDevice Responce",data);
        if(err != null) {
            // res.send(JSON.stringify(err));
            let response = { message:"Something went wrong. Please try again later.", success:false };
            res.send(JSON.stringify(response));
        }
        else {
            if(data != null && data != "") {
                /** 1. If user already exist, update its deviceRegisteredId and devicePlatform **/
                loginService.updateRegisterUserDevice(req.body,function(err,data){
                    console.log("registerUserDevice Error",err);          
                    console.log("registerUserDevice Responce",data);
                    if(err != null) {
                        // res.send(JSON.stringify(err));
                        let response = { message:"Something went wrong.", success:false };
                        res.send(JSON.stringify(response));
                    }
                    else {
                        let response = { message:"User Updated Successfully.", success:true };
                        res.send(JSON.stringify(response));
                    }
                });
            }
            else {
                /** 2. If user do not exist, add user in DB **/
                loginService.registerUserDevice(req.body,function(err,data){
                    console.log("registerUserDevice Error",err);          
                    console.log("registerUserDevice Responce",data);
                    if(err != null) {
                        // res.send(JSON.stringify(err));
                        let response = { message:"Something went wrong.", success:false };
                        res.send(JSON.stringify(response));
                    }
                    else {
                        let response = { message:"User Registered Successfully.", success:true };
                        res.send(JSON.stringify(response));
                    }
                });
            }
        }
    });
}

// Forgrt Password
exports.forgetPassword = function(req, res, next) {
    console.log("Inside Server Forget Password Login Controller",req.body);
    // var userDeaits = {"user_email": req.body.user_email};
    //console.log(userDeaits);
    /** Getting the data of the user **/
    loginService.login({"user_email": req.body.user_email}, function(err,data){
        console.log(err);
        console.log("Responce",data);
        if (err != null) {
            // res.send("Something went wrong."+JSON.stringify(err));
            let response = { message : "Something went wrong. Please try again later.", success : false };
            res.send(JSON.stringify(response));
        }
        else {
            let response = { message:"", success: true, userdata:"" };
            if(data != null && data != "") {
                response.success = true;
                response.message = 'Password has been sent to your Email. Please check.';

                /** Sending the email to the user **/
                this.sendEmail(data[0], res, response);
                // res.send(response);
            }
            else {
                response.success = false;
                response.message = 'This User Email do not Exists.';
                res.send(response);
            }

        }
    });
}


/** Email Sending **/
var nodemailer = require("nodemailer");
sendEmail = function(data, res, responseMessageObj) {
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

    var html = "Hi "+data.user_username+", <br><br> Your details are given below : <br>"+ 
    "<b>Username :</b> "+data.user_username+"<br>"+
    "<b>Email :</b> "+data.user_email+"<br>"+
    "<b>Mobile Number :</b> "+data.user_mobile+""+
    "<h2>Password : "+data.user_password+"</h2><br>"+
    "Happy Riding !<br>"+
    "<b>Thanks,</b><br>"+
    "JRides Team.";
    var htmlMessage = html;
    var sendemailto = data.user_email;
    var emailSubject = "Forget Password Request";

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
		if(error) {
            console.log(error);
            responseMessageObj.success = false;
            responseMessageObj.message = "Something went wrong. Please try again later.";
            res.send(responseMessageObj);
		} else {
            console.log("Email sent: ", response);
            res.send(responseMessageObj);
		}
	});
}