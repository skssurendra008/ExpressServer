
var mongoose = require('mongoose');
var UserDetailsSchema = mongoose.Schema({
    user_username: {
        type: String,
        require: true,
        unique: true
     },
    user_firstname: {
        type: String,
        require: true
     },
    user_lastname: {
        type: String,
        require: true
     },
     user_password: {
         type: String,
         require: true
     },
    user_mobile: {
        type: Number
    },
    user_email: {
        type: String,
        require: true
    },
    user_profileimage: {
        type: String
    }/*,
     user_address: {
         type: String
     }*/
},
{ collection: 'userdetails' }); // collection = table name in DB

module.exports = mongoose.model('userdetails', UserDetailsSchema); 