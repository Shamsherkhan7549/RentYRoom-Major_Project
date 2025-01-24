const mongoose = require('mongoose');
const {Schema} = mongoose;
const {REVIEW} = require('./reviewSchema');
const USER = require('./userSchema')

const RentYRoomSchema = new Schema({
    title:{
        type:String,
        required:true
    }, 
    description:{
        type:String,
        maxLength:1000
    }, 
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:REVIEW
        }
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:USER
    },

    category:{
        type:String,
        required:true
    }


});

// mongoose middleware
RentYRoomSchema.post('findOneAndDelete',async(data)=>{
    const deletedReview =  await REVIEW.deleteMany({_id:{$in:data.reviews}});
    return
})

const Room = mongoose.model('Room', RentYRoomSchema);

module.exports = Room;