
var express = require('express');
const jwt = require('jsonwebtoken');

//import service folder
var loginService = require('../services/loginService');

// To check user availability while login
// exports.login = function(req, res, next) {
//     console.log("Inside Server Login Controller");
//     var userDeaits = {"user_username": req.body.user_username};
//     loginService.getDataFromUserdetailsTable(userDeaits, function(err,data){
//         if (err) {
//             res.send("Invalid user"+JSON.stringify(err));
//         }
//         else {
//             response = { message:"", success:true, userData:"" };
//             if(data != null && data != "") {
//                 var isUserIndex = data.map(function(e) { return e.user_username; }).indexOf(req.body.user_username);
//                 //console.log("UserName1 = "+data[0].user_username );
//                if(data[0].user_username == req.body.user_username) {
//                     if(data[0].user_password == req.body.user_password) {
//                         response.userData = data[0];
//                         response.message = 'User Exists';

//                         /** Sendind response with jwtToken**/
//                         let userDetails = {};
//                         userDetails.user_username = req.body.user_username;
//                         userDetails.user_password = req.body.user_password;
//                         jwt.sign({user : userDetails}, 'secretkey', (err, token) => {
//                             response.jwtToken = token;
//                             res.send(response);
//                         });
                        
//                         /** insert device details into DB **/
//                         let deviceDetails = {};
//                         deviceDetails.deviceRegisteredId = req.body.deviceRegisteredId;
//                         deviceDetails.devicePlatform = req.body.devicePlatform;
//                         deviceDetails.deviceUsername = req.body.user_username;
//                         let deviceResponse = registerUserDevice(deviceDetails);

//                     } else {
//                         response.success = false;
//                         response.message = 'Password Mismatch';
//                         res.send(response);
//                     }
//                 }
//             }
//             else {
//                 response.success = false;
//                 response.message = 'User do not Exists';
//                 res.send(response);
//             }

//         }
//     });
// }

// // To register new user
// exports.registerUser = function(req, res, next) {
//     console.log("Inside Server registerUser Controller");
//     loginService.insertDataInUserdetailsTable(req.body,function(err, data) {
//         // console.log("RegisterUser = ", data);
//         // console.log("RegisterUser Error = ", err);
//         if(err != null) {
//             let response = { message:"", success:true };
//             if(err.errmsg.indexOf("user_username") > -1) {
//                 response.message = "The username is already registered."
//             } else if(err.errmsg.indexOf("user_email") > -1) {
//                 response.message = "The email address is already registered."
//             }
//             res.send(JSON.stringify(response));
//         }
//         else {
//             let response = { message:"User Created Successfully.", success:true, userData: data};
//             /** insert device details **/
//             let deviceDetails = {};
//             deviceDetails.deviceRegisteredId = req.body.deviceRegisteredId;
//             deviceDetails.devicePlatform = req.body.devicePlatform;
//             deviceDetails.deviceUsername = req.body.user_username;
            
//             loginService.insertDataInUserDevicedetailsTable(deviceDetails, function(deviceerr, devicedata) {
//                 if(deviceerr != null) {
//                     /** 1. delete inserted user details **/
//                     loginService.deleteUser(data._id, function(deleteusererr, deleteuserdata) {
//                         if(deleteusererr != null) {
//                             /** If user not deleted and now mobile details are not available so login again **/
//                             let response = { message:"Something went wrong. Please login again to get mobile notification.", success:false };
//                             res.send(JSON.stringify(response));
//                         } else {
//                             let response = { message:"Something went wrong with you device. Please register again.", success:false };
//                             res.send(JSON.stringify(response));
//                         }
//                     });
//                 }
//                 else {
//                     /** Sendind response with jwtToken**/
//                     let userDetails = {};
//                     userDetails.user_username = req.body.user_username;
//                     userDetails.user_password = req.body.user_password;
//                     jwt.sign({user : userDetails}, 'secretkey', (err, token) => {
//                         response.jwtToken = token;
//                         res.send(JSON.stringify(response));
//                     });
//                 }
//             });

//         }
//     });
// }


// registering User Details after login from Microsoft (SSO)
exports.registerUserDetails = function(req, res, next) {
    console.log("Inside Server registerUserDetails Controller");
    loginService.getDataFromUserdetailsTable({"user_email": req.body.user_email}, function(err,data) {
        if (err) {
            let response = { message:"Something went wrong. Please login again.", success:false };
            res.send(JSON.stringify(response));
        }
        else {
            // on success we have two cases
            // 1. user already exist => send user details along with jwt token
            // 2. user do not exist => registerUser, registerUserDevice in DB and send it with jwt token
            response = { message: "", success: true, userData: "" };
            if(data != null && data != "") {
                response.userData = data[0];
                response.message = 'User Exists';
                
                /** Sendind response with jwtToken**/
                let userDetails = {};
                userDetails.user_email = req.body.user_email;
                jwt.sign({user : userDetails}, 'secretkey', (err, token) => {
                    response.jwtToken = token;
                    res.send(JSON.stringify(response));
                });

                /** insert/update device details into DB **/
                let deviceDetails = {};
                deviceDetails.deviceRegisteredId = req.body.deviceRegisteredId;
                deviceDetails.devicePlatform = req.body.devicePlatform;
                deviceDetails.deviceUsername = req.body.user_username;
                let deviceResponse = registerUserDevice(deviceDetails);
            }
            else {
                loginService.insertDataInUserdetailsTable(req.body,function(err, data) {
                    if(err != null) {
                        // let response = { message:"", success:true };
                        // if(err.errmsg.indexOf("user_username") > -1) {
                        //     response.message = "The username is already registered."
                        // } else if(err.errmsg.indexOf("user_email") > -1) {
                        //     response.message = "The email address is already registered."
                        // }
                        let response = { message:"Something went wrong. Please login again.", success:false };
                        res.send(JSON.stringify(response));
                    }
                    else {
                        let response = { message:"User Created Successfully.", success:true, userData: data};
                        /** insert device details **/
                        let deviceDetails = {};
                        deviceDetails.deviceRegisteredId = req.body.deviceRegisteredId;
                        deviceDetails.devicePlatform = req.body.devicePlatform;
                        deviceDetails.deviceUsername = req.body.user_username;
                        
                        loginService.insertDataInUserDevicedetailsTable(deviceDetails, function(deviceerr, devicedata) {
                            if(deviceerr != null) {
                                /** 1. delete inserted user details **/
                                loginService.deleteUser(data._id, function(deleteusererr, deleteuserdata) {
                                    if(deleteusererr != null) {
                                        /** If user not deleted and now mobile details are not available so login again **/
                                        let response = { message:"Something went wrong. Please login again to get mobile notification.", success:false };
                                        res.send(JSON.stringify(response));
                                    } else {
                                        let response = { message:"Something went wrong with you device. Please register again.", success:false };
                                        res.send(JSON.stringify(response));
                                    }
                                });
                            }
                            else {
                                /** Sendind response with jwtToken**/
                                let userDetails = {};
                                userDetails.user_email = req.body.user_email;
                                // userDetails.user_password = req.body.user_password;
                                jwt.sign({user : userDetails}, 'secretkey', (err, token) => {
                                    response.jwtToken = token;
                                    res.send(JSON.stringify(response));
                                });
                            }
                        });
            
                    }
                });
            }
        }
    });
}


// To get getUserDetails
exports.getUserDetails = function(req, res, next) {
    console.log("Inside Server getUserDetails Controller");
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            loginService.getDataFromUserdetailsTable({"user_username": req.body.user_username}, function(err,data){
                if (err) {
                    // res.send("Invalid user"+JSON.stringify(err));
                    let response = { message: "Something went wrong. Please try again later.", success: false };
                    res.send(response);
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

// To update user details 
exports.updateUserDetails= function(req, res) {
    console.log("Inside Server updateUserDetails Controller");
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            let response = { message:"Token Error. Please login again.", success:false };
            res.send(JSON.stringify(response));
        } else {
            if(req.body.user_updatedetail) {
                loginService.updateUserDetails(req.body, function(err, data){
                    if(err) {
                        let response = { message:"Something went wrong. Please try again later.", success:false };
                        res.send(response);
                    }
                    else {
                        let response = { message:"Updated Successfully.", success:true };
                        res.send(JSON.stringify(response));
                    }
                });
            } else {
                loginService.updateUsercompleteDetails(req.body, function(err, data){
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
        }
    });
}

// To register/update new user device details
// exports.registerUserDevice = function(req, res, next) {
registerUserDevice = function(deviceDetails) {
    console.log("Inside Server registerUserDevice Controller");
    /** Getting the details of the user **/
    loginService.getDataFromUserDevicedetailsTable({"deviceUsername" : deviceDetails.deviceUsername}, function(err,data){
        if(err != null) {
            let response = { message:"Something went wrong. Please try again later.", success:false };
            return response;
        }
        else {
            if(data != null && data != "") {
                /** 1. If user already exist, update its deviceRegisteredId and devicePlatform **/
                loginService.updateRegisterUserDevice(deviceDetails, function(err,data){     
                    if(err != null) {
                        let response = { message:"Something went wrong.", success:false };
                        return response;
                    }
                    else {
                        let response = { message:"User Updated Successfully.", success:true };
                        return response;
                    }
                });
            }
            else {
                /** 2. If user do not exist, add user in DB **/
                loginService.insertDataInUserDevicedetailsTable(deviceDetails, function(err,data){
                    if(err != null) {
                        let response = { message:"Something went wrong.", success:false };
                        return response;
                    }
                    else {
                        let response = { message:"User Registered Successfully.", success:true };
                        return response;
                    }
                });
            }
        }
    });
}

// Forget Password
// exports.forgetPassword = function(req, res, next) {
//     console.log("Inside Server Forget Password Login Controller");
//     /** Getting the data of the user **/
//     loginService.getDataFromUserdetailsTable({"user_email": req.body.user_email}, function(err,data) {
//         if (err != null) {
//             let response = { message : "Something went wrong. Please try again later.", success : false };
//             res.send(JSON.stringify(response));
//         }
//         else {
//             let response = { message:"", success: true, userdata:"" };
//             if(data != null && data != "") {
//                 response.success = true;
//                 response.message = 'Password has been sent to your Email. Please check.';

//                 /** Sending the email to the user **/
//                 this.sendEmail(data[0], res, response);
//             }
//             else {
//                 response.success = false;
//                 response.message = 'This User Email do not Exists.';
//                 res.send(response);
//             }

//         }
//     });
// }


// /** Email Sending to user for Forget Password **/
// var nodemailer = require("nodemailer");
// sendEmail = function(data, res, responseMessageObj) {
//     // console.log("Send email = ", data);
//     var smtpTransport = nodemailer.createTransport({
// 		service: 'gmail',
// 		// host: 'smtp.gmail.com',
// 		port: 587,
// 		secure: true, // false,
// 		auth: {
// 			user: 'noreply.jrides@gmail.com',
// 			pass: 'Abcd@1234'
// 		},
// 		tls: {rejectUnauthorized: false}
// 	});

//     var html = "Hi "+data.user_username+", <br><br> Your details are given below : <br>"+ 
//     "<b>Username :</b> "+data.user_username+"<br>"+
//     "<b>Email :</b> "+data.user_email+"<br>"+
//     "<b>Mobile Number :</b> "+data.user_mobile+""+
//     "<h2>Password : "+data.user_password+"</h2><br>"+
//     "Happy Riding !<br>"+
//     "<b>Thanks,</b><br>"+
//     "JRides Team.";
//     var htmlMessage = html;
//     var sendemailto = data.user_email;
//     var emailSubject = "Forget Password Request";

// 	// setup e-mail data with unicode symbols
// 	var mailOptions = {
// 		from: '"JRide Team" <noreply.jrides@gmail.com>', // sender address
// 		to: sendemailto, // list of receivers
// 		subject: emailSubject, // Subject line
// 		// text: "Hello world ", // plaintext body
// 		html:  htmlMessage// html body
// 	}

// 	// send mail with defined transport object
// 	smtpTransport.sendMail(mailOptions, function(error, response){
// 		if(error) {
//             // console.log(error);
//             responseMessageObj.success = false;
//             responseMessageObj.message = "Something went wrong. Please try again later.";
//             res.send(responseMessageObj);
// 		} else {
//             // console.log("Email sent: ", response);
//             res.send(responseMessageObj);
// 		}
// 	});
// }