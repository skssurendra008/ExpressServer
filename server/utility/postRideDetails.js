
var mongoose = require('mongoose');
var RideDetailsSchema = mongoose.Schema({
    username: {
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
    mobile_num: {
        type: Number
     },
    vehicaleNumber: {
        type: String,
        require: true
    },
    departureTime: {
        type: Date
    },
    estimatedPrice: {
        type: Number
    },
    bookings: [
        {
            username: String,
            mobileNumber: Number,
            bookedSeats: Number,
            source: String,
            destination: String,
            bookingStatus: String
        }
    ]
},
{ collection: 'rideDetails' }); // collection = table name in DB

module.exports = mongoose.model('rideDetails', RideDetailsSchema); 