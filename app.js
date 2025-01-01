const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const Room = require('./model/schema');
const ejsMate = require('ejs-mate');
const ExpressError = require('./ExpressError/ExpressError');
const wrapAsync = require('./utils/util')

const app = express();
const port = 8080;

app.set('views', path.join(__dirname,'view'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public/css'));
app.use(express.static('public/js'));

app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

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





app.get('/', wrapAsync( async(req, res,next)=>{
    const rooms = await Room.find();
    res.render('Root.ejs', {rooms});
}));

app.get('/listings',wrapAsync( async(req,res,next)=>{
    const rooms = await Room.find();
    res.render('Listings.ejs', {rooms});
}));

app.get('/listings/new',wrapAsync((req,res,next)=>{
    res.render('new.ejs');
}));

app.get('/listings/:id',wrapAsync( async(req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    if(!room){
        return next(new ExpressError(402, "Invalid Id"))
    }
    res.render("itemsDetails.ejs",{room});
}));

app.post('/listings',wrapAsync( async(req,res,next)=>{
    const{listing} = req.body;
    if(!listing){
        next(new ExpressError(404, 'Please enter valid data'))
    };
    const room =  new Room(listing);
    
    if(!room.title){
        next(new ExpressError(404, 'Title is missing!'))
    }else if(!room.description){
        next(new ExpressError(404, 'Description is missing!'))
    }else if(!room.location){
        next(new ExpressError(404, 'Location is missing!'))
    }else if(!room.country){
        next(new ExpressError(404, 'Country is missing!'))
    }
    await room.save()
    res.redirect('/listings');
}));

//Edit rout
app.get('/listings/:id/edit', wrapAsync(async(req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    res.render('edit.ejs', {room});
}));

app.put('/listings/:id',wrapAsync( async(req,res,next)=>{
    const {id} = req.params;
    const{listing} = req.body;
    if(!listing){
        next(new ExpressError(400, 'Please enter valid data'))
    }
    const room = await Room.findByIdAndUpdate(id,{...listing});
    
    res.redirect(`/listings/${id}`);
}));


app.delete('/listings/:id',wrapAsync( async(req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findByIdAndDelete(id);
    res.redirect('/listings');
}));

app.all('*', (req, res, next) =>{
    next(new ExpressError(404, 'Page not found!'))
});

// const handlingErrByName = (err, req, res) => {
//     if(err.name === 'CastError'){
//         const {name, status = 400, message = 'Something went wrong!'} = err;
//         return res.send('error.ejs', {name, status, message})
//     }

//     next(err)
// }

// app.use((err, req, res, next) => {
//     const {status = 400, message = 'Error Occured!'} = err
//     handlingErrByName(err, req, res)
//     next(err);
// });

//Error Handling Middleware
app.use((err, req, res, next) => {
    const {name, status = 400, message = 'Something went wrong!'} = err;
    res.status(status).render('error.ejs',{name, status, message});
// res.send('something went wrong')
})

app.listen(port, (req, res)=>{
    console.log(`server listening on port ${port}`)
});