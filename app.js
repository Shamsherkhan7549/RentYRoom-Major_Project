const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const Room = require('./model/schema');
const ejsMate = require('ejs-mate');
const ExpressError = require('./ExpressError/ExpressError');
const wrapAsync = require('./utils/util');
const {joiSchema, reveiwJoiSchema} = require('./joiSchema.js');
const Joi = require('joi');
const {REVIEW} = require('./model/reviewSchema.js')

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
    const room = await Room.findById(id).populate('reviews');
    if(!room){
        return next(new ExpressError(402, "Invalid Id"))
    }
    res.render("itemsDetails.ejs",{room});
}));

//data save route
app.post('/listings',wrapAsync( async(req,res,next)=>{
    const{listing} = req.body;
    const {error} =  joiSchema.validate(listing); 
    if(error){
     return next( new ExpressError(404, error.details[0].message))
    }
    const room =  new Room(listing);
    await room.save()
    res.redirect('/listings');
}));

//Edit route
app.get('/listings/:id/edit', wrapAsync(async(req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    res.render('edit.ejs', {room});
}));

// edit route
app.put('/listings/:id',wrapAsync( async(req,res,next)=>{
    const {id} = req.params;
    const{listing} = req.body;

    //joi error handling 
    const {error} =  joiSchema.validate(listing);  

    if(error){
     return next( new ExpressError(404, error.details[0].message))
    }

    const room = await Room.findByIdAndUpdate(id,{...listing});
    res.redirect(`/listings/${id}`);
}));

// delete rooms
app.delete('/listings/:id',wrapAsync( async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        return next(new ExpressError(404, `item not found on this ${id}`))
     };
    const room = await Room.findByIdAndDelete(id);
    
    res.redirect('/listings');
}));

// review
app.post('/listings/:id/review',wrapAsync( async(req, res) => {
    const {review} = req.body;
    const {error} = reveiwJoiSchema.validate(review);
    if(error){
        return next(ExpressError(404, error.details[0].message))
    }
    const {id} = req.params;
    const result = new REVIEW(review);
    const result2 = await Room.findById(id);
    const result3 = result2.reviews.push(result);
    await result.save();
    const reviewSavedRooms = await result2.save();
    res.redirect(`/listings/${id}`)
}));

// delete review
app.delete('/listings/:id/review/:reviewId',wrapAsync( async(req, res)=> {
    const{id, reviewId} = req.params;
    const deletedReview = await REVIEW.findByIdAndDelete(reviewId);
    const reviewListInRoom = await Room.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    // const room = await Room.findById(id);
    // room.reviews = room.reviews.filter(review=>review._id === reviewId)
    // const savedRoom = await room.save();
    res.redirect(`/listings/${id}`);
}))



app.all('*', (req, res, next) =>{
    next(new ExpressError(404, 'Page not found!'))
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    const {name, status = 400, message = 'Something went wrong!'} = err;
    res.status(status).render('error.ejs',{name, status, message});
})

app.listen(port, (req, res)=>{
    console.log(`server listening on port ${port}`)
});