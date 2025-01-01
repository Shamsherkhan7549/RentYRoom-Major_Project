const mongoose = require('mongoose');
const {Schema} = mongoose;

const RentYRoomSchema = new Schema({
    title:{
        type:String,
        required:true
    }, 
    description:{
        type:String,
        maxLength:100
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
    }

});

const Room = mongoose.model('Room', RentYRoomSchema);

module.exports = Room;