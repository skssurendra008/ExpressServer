
var express = require('express');

//import service folder
var loginService = require('../services/loginService');

// To check user availability while login
exports.login = function(req, res, next) {
    console.log("Inside Server Login Controller",req.body);
    var userDeaits = {"user_username": req.body.user_username};
    //console.log(userDeaits);
    loginService.login(userDeaits, function(err,data){
        console.log(err);
        console.log("Responce",data);
        if (err) {
            res.send("Invalid user"+JSON.stringify(err));
        }
        else {
            //res.send("Token Session JWT , Success message"+JSON.stringify(data));
            response = { message:"", success:true, userdata:"" };
            if(data != null && data != "") {
                var isUserIndex = data.map(function(e) { return e.user_username; }).indexOf(req.body.user_username);
                //console.log("UserName1 = "+data[0].user_username );
               if(data[0].user_username == req.body.user_username) {
                    if(data[0].user_password == req.body.user_password) {
                        response.userData = data[0];
                        response.message = 'User Exists';
                        res.send(response);
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
    loginService.login({"user_username": req.body.user_username}, function(err,data){
        console.log(err);
        console.log("Responce",data);
        if (err) {
            res.send("Invalid user"+JSON.stringify(err));
        }
        else {
            response = { message: "", success:true, userdata: "" };
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

// To register new user
exports.registerUser = function(req, res, next) {
    console.log("Inside Server registerUser Controller",req.body);
    loginService.registerUser(req.body,function(err,data){
        //console.log("Register User Error",err);
        //console.log(err.errmsg.indexOf("user_username"));          
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
exports.updateUserDetails= function(req, res, next) {
    console.log("Inside Server updateUserDetails Controller",req.body);
    loginService.updateUserDetails(req.body,function(err,data){
        console.log(err);
        console.log("responce",data);
        if(err) {
            res.send("invalid user"+JSON.stringify(err));
        }
        else {
            let response = { message:"Updated Successfully.", success:true };
            res.send(JSON.stringify(response));
        }
    });
}
