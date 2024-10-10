const mongoose = require('mongoose');

const ds = new mongoose.Schema({
    username: {
        type: String,
        required: true,   
        unique: true,     
        trim: true       
    },
    password: {
        type: String,
        required: true    
    }
});

const Data = mongoose.model('Data', ds);

module.exports = Data;
