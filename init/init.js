const mongoose = require('mongoose');
const Room = require('../model/schema');
const allData = require('./data ');

//server
main().then(result=>{
    console.log('mongoose is working');
}).catch(error=>{
    console.log("some error found in mongoose", error);
});

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/RentYRoom');
};

const initDb = async() =>{
    await Room.deleteMany({});
    
    allData.data= allData.data.map(obj=>({...obj, owner:'67828f8dad3c2fddf8fecca0'}))
    
    await Room.insertMany(allData.data);
    console.log("data initialized")
};

initDb();



