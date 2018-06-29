
var mongoose = require('mongoose');
var BookRideDetailsSchema = mongoose.Schema({
    rideownerUsername: { // ride owner username
        type: String,
        require: true
     },
    myusername: {
        type: String,
        require: true
     },
    email: {
        type: String,
        require: true
     },
    uniqueRideName: {   /**** Ride posted username + Ride booked username ****/
        type: String,
        require: true
     },
    source: {
        type: String,
        require: true
        // unique: true
     },
    destination: {
        type: String,
        require: true
     },
    vehicleType: {
        type: String,
        require: true
     },
    vehicleName: {
         type: String,
         require: true
     },
    rideTitle: {
        type: String,
        require: true
     },
    availableSeats: {
         type: Number,
         require: true
     },
    bookedSeats: {
        type: Number,
        require: true
    },
    mobileNumber: {
        type: Number
     },
    vehicleNumber: {
        type: String,
        require: true
    },
    departureTime: {
        type: Date
    },
    estimatedPrice: {
        type: Number
    },
    bookingStatus: {
        type:  String
    }
},
{ collection: 'bookRideDetails' }); // collection = table name in DB

module.exports = mongoose.model('bookRideDetails', BookRideDetailsSchema); 