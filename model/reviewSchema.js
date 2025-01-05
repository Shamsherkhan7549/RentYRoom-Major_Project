const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewSchema = new Schema({
    remarks:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },

    created_at:{
        type:Date,
        default:Date.now   
    }
});

const REVIEW = mongoose.model('REVIEW', reviewSchema);

module.exports = {REVIEW}