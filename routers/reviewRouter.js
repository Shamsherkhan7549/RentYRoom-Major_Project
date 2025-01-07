const express = require('express');
const router = express.Router();
const {reviewJoiSchema} = require('../joiSchema.js');
const {REVIEW} = require('../model/reviewSchema.js');
const wrapAsync = require('../utils/util');
const ExpressError = require('../ExpressError/ExpressError');
const Room = require('../model/schema.js');
const Joi = require('joi');

const validateReview = (err,req,res, next) => {
    const {error} = reviewJoiSchema.validate(req.body);
    if(error){
        return next(new ExpressError(404, error.details[0].message))
    }
    return next()
}

// review
router.post('/:id/review',validateReview,wrapAsync( async(req, res,next) => {
    const {review} = req.body; 
    const {id} = req.params;
    const newReview = new REVIEW(review);
    const room = await Room.findById(id);
    const result3 = room.reviews.push(newReview);
    await newReview.save();
    const roomSavedReview = await room.save();
    res.redirect(`/listings/${id}`)

}));

// delete review
router.delete('/:id/review/:reviewId',wrapAsync( async(req, res,next)=> {
    const{id, reviewId} = req.params;
    if(!id || !reviewId){
        return next(ExpressError(404, `item not found at this ${id||reviewId}`))
    }
    const deletedReview = await REVIEW.findByIdAndDelete(reviewId);
    const reviewListInRoom = await Room.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    // const room = await Room.findById(id);
    // room.reviews = room.reviews.filter(review=>review._id === reviewId)
    // const savedRoom = await room.save();
    res.redirect(`/listings/${id}`);
}));

module.exports = router


