
var mongoose = require('mongoose');
var registeredDeviceSchema = mongoose.Schema({
    deviceUsername: {
        type: String,
        require: true,
        unique: true
     },
    devicePlatform: {
        type: String,
        require: true
     },
    deviceRegisteredId: {
        type: String,
        require: true
     }
},
{ collection: 'userDeviceDetails' }); // collection = table name in DB

module.exports = mongoose.model('userDeviceDetails', registeredDeviceSchema); 