var app = require('express');
var router = app.Router();

var userLoginController = require('../server/controller/LoginController');
var rideController = require('../server/controller/RideController');


router.post('/login', userLoginController.login);
router.post('/userDetails', verifyToken, userLoginController.getUserDetails);
router.post('/registerUser',userLoginController.registerUser);
router.post('/updateUserDetails', verifyToken, userLoginController.updateUserDetails);
router.post('/forgetPassword',userLoginController.forgetPassword);

router.post('/registerUserDevice',userLoginController.registerUserDevice);


router.post('/postRide', verifyToken, rideController.postRide);
router.post('/getAllRide', rideController.getAllRide);
router.post('/myPostedRides', verifyToken, rideController.myPostedRides);
router.post('/bookRide', verifyToken, rideController.bookRide);
router.post('/myBookedRide', verifyToken, rideController.myBookedRide);
router.post('/updateRideStatus', verifyToken, rideController.updateRideStatus);


router.get('/',function(req,res,next){
    console.log("I am start");
    res.send("I am ready to use");
});


/** Verify JWT Token **/
function verifyToken(req, res, next) {
    const headerToken = req.headers['authorization'];
    console.log("headerToken ", headerToken);
    if (typeof headerToken != 'undefined' && headerToken) {
        // console.log("1");
        req.token = headerToken;
        next();
    } else {
        // console.log("2");
        // res.sendStatus(403);
        let response = { message:"JWT Token Required.", success:false };
        res.send(JSON.stringify(response));
    }
}
/** */

module.exports = router;
