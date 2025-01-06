const mongoose = require('mongoose');
const {Schema} = mongoose;
const {REVIEW} = require('./reviewSchema')

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
        type:String,
        default:"https://images.pexels.com/photos/6776756/pexels-photo-6776756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        set:(v)=>v==="" ? "https://images.pexels.com/photos/6776756/pexels-photo-6776756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" : v
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
    ]


});

// mongoose middleware
RentYRoomSchema.post('findOneAndDelete',async(data)=>{
    const deletedReview =  await REVIEW.deleteMany({_id:{$in:data.reviews}});
    console.log(deletedReview);
    return
})

const Room = mongoose.model('Room', RentYRoomSchema);

module.exports = Room;