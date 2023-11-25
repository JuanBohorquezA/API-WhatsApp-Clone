const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    PhoneNumber:{
        type:String,
        require:true
    },
    Name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Photo:{
        type:String,
        require:true
    }

})
module.exports = mongoose.model('User',UserSchema)