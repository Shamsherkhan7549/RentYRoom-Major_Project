const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const Room = require('./model/schema');

const app = express();
const port = 8080;

app.set('views', path.join(__dirname,'view'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

//server
main().then(result=>{
    console.log('mongoose is working')
}).catch(error=>{
    console.log("some error found in mongoose", error)
});

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/RentYRoom')
};

// const data = new Room({
//     title: "Ski Chalet in Aspen",
//     description:"Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
//     image:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     price: 4000,
//     location: "Aspen",
//     country: "United States",
//   }).save().then(result=>{
//     console.log(result)
//   }).catch(err=>{
//     console.log(err)
//   });
//server

app.get('/', async(req, res)=>{
    const rooms = await Room.find();
    res.render('Root.ejs', {rooms});
});

app.get('/listings', async(req,res)=>{
    const rooms = await Room.find();
    res.render('Listings.ejs', {rooms});
});

app.get('/listings/new',(req,res)=>{
    res.render('new.ejs');
});

app.get('/listings/:id', async(req,res)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    res.render("itemsDetails.ejs",{room});
});

app.post('/listings', async(req,res)=>{
    const{listing} = req.body
    const room = await new Room(listing).save();
    res.redirect('/listings');
});

//Edit rout
app.get('/listings/:id/edit', async(req,res)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    res.render('edit.ejs', {room});
});
app.put('/listings/:id', async(req,res)=>{
    const {id} = req.params;
    const{title, description, image, price, location, country} = req.body.listing;
    const room = await Room.findByIdAndUpdate(id,{title:title, description:description, image:image, price:price, location:location, country:country});
    res.redirect('/listings');
});


app.delete('/listings/:id', async(req,res)=>{
    const {id} = req.params;
    const room = req.body;
    console.log(room)
    res.redirect('/listings');
});

app.listen(port, (req, res)=>{
    console.log(`server listening on port ${port}`)
});