
var mongoose = require('mongoose');
var UserDetailsSchema = mongoose.Schema({
    user_username: {
        type: String,
        require: true,
        unique: true
     },
    user_fullname: {
        type: String,
        require: true
    },
//     user_firstname: {
//         type: String,
//         require: true
//     },
//     user_lastname: {
//         type: String,
//         require: true
//     },
    user_password: {
         type: String,
         require: true
    },
    user_mobile: {
        type: String
    },
    user_email: {
        type: String,
        require: true,
        unique: true
    },
    user_profileimage: {
        type: String
    },
    user_type: {
        type: String
    },
    officeLocation: {
        type: String
    },
    homeLocation: {
        type: String
    },
    rideRoute: {
        type: String
    },
    vehicleType: {
        type: String
    },
    vehicleName: {
        type: String
    },
    vehicleNumber: {
        type: String
    },
    availableSeats: {
        type: Number
    }/*,
     user_address: {
         type: String
     }*/
},
{ collection: 'userdetails' }); // collection = table name in DB

module.exports = mongoose.model('userdetails', UserDetailsSchema); 