var app = require('express');
var router = app.Router();

var userLoginController = require('../server/controller/LoginController');
var rideController = require('../server/controller/RideController');


router.post('/login', userLoginController.login);
router.post('/userDetails',userLoginController.getUserDetails);
router.post('/registerUser',userLoginController.registerUser);
router.post('/updateUserDetails', verifyToken, userLoginController.updateUserDetails);
router.post('/forgetPassword',userLoginController.forgetPassword);

router.post('/registerUserDevice',userLoginController.registerUserDevice);


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


/** Verify JWT Token **/
function verifyToken(req, res, next) {
    const headerToken = req.headers['authorization'];
    console.log("headerToken ", headerToken);
    if (typeof headerToken != 'undefined') {
        req.token = headerToken;
        next();
    } else {
        // res.sendStatus(403);
        let response = { message:"JWT Token Required.", success:false };
        res.send(JSON.stringify(response));
    }
}
/** */

module.exports = router;
