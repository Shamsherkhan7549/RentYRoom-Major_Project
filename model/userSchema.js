const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },

    
});

// const USER = mongoose.model('USER', userSchema)

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('USER', userSchema);