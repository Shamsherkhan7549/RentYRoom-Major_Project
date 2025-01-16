const mongoose = require('mongoose');
const {Schema} = mongoose;
const USER = require('./userSchema')
const reviewSchema = new Schema({
    remarks:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
        default:3
    },

    created_at:{
        type:Date,
        default:Date.now()  
    },

    author:{
        type:Schema.Types.ObjectId,
        ref:USER
    }
});

const REVIEW = mongoose.model('REVIEW', reviewSchema);

module.exports = {REVIEW}