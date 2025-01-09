const express = require('express');
const router = express.Router();
const Room = require('../model/schema');
const wrapAsync = require('../utils/util');
const ExpressError = require('../ExpressError/ExpressError');
const {joiSchema} = require('../joiSchema');
const Joi = require('joi');


//joi error handling 
const validateRooms = (err, req, res, next) => {
    const {error} =  joiSchema.validate(req.body); 
    if(error){
     return next( new ExpressError(404, error.details[0].message))
    }
}


router.get('/',wrapAsync( async(req,res,next)=>{
    const rooms = await Room.find();
    res.render('Listings.ejs', {rooms});
}));

router.get('/new',wrapAsync((req,res,next)=>{
    res.render('new.ejs');
}));

router.get('/:id', wrapAsync( async(req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findById(id).populate('reviews');
    if(!room){
        req.flash('error', 'User not found on this id');
        // return next(new ExpressError(402, "Invalid Id"))
        res.redirect('/listings');
    }
    res.render("itemsDetails.ejs",{room});
}));

//data save route
router.post('/', validateRooms, wrapAsync( async(req,res,next)=>{
    const{listing} = req.body;
    const room =  new Room(listing);
    await room.save();
    req.flash('success', 'New Room Added');
    res.redirect('/listings');
}));

//Edit route
router.get('/:id/edit', wrapAsync(async(req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    if(!room){
        req.flash('error', 'User not found on this id');
        // return next(new ExpressError(402, "Invalid Id"))
        res.redirect('/listings');
    }
    res.render('edit.ejs', {room});
}));

// edit route
router.put('/:id', validateRooms, wrapAsync(async(req,res,next)=>{
    const {id} = req.params;
    const{listing} = req.body;
    const room = await Room.findByIdAndUpdate(id,{...listing});
    req.flash('success', 'Room updated');

    res.redirect(`/listings/${id}`);
}));

// delete rooms
router.delete('/:id',wrapAsync( async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        return next(new ExpressError(404, `item not found on this ${id}`))
     };
    const room = await Room.findByIdAndDelete(id);
    req.flash('success', 'One room deleted');
    res.redirect('/listings');
}));

module.exports = router