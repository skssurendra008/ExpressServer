var app = require('express');
var router = app.Router();

var userLoginController = require('../server/controller/LoginController');
var rideController = require('../server/controller/RideController');


router.post('/login', userLoginController.login);
router.post('/userDetails',userLoginController.getUserDetails);
router.post('/registerUser',userLoginController.registerUser);
router.post('/updateUserDetails',userLoginController.updateUserDetails);


router.post('/postRide', rideController.postRide);
router.post('/getAllRide', rideController.getAllRide);
router.post('/myPostedRides', rideController.myPostedRides);
router.post('/bookRide', rideController.bookRide);
router.post('/myBookedRide', rideController.myBookedRide);
router.post('/updateRideStatus', rideController.updateRideStatus);


router.get('/',function(req,res,next){
    console.log("I am start");
    res.send("I am ready to use");
});

module.exports = router;
