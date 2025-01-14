const express = require('express');
const router = express.Router();
const {reviewJoiSchema} = require('../joiSchema.js');
const {REVIEW} = require('../model/reviewSchema.js');
const wrapAsync = require('../utils/util');
const ExpressError = require('../ExpressError/ExpressError');
const Room = require('../model/schema.js');
const Joi = require('joi');
const {validateReview,isLoggedIn, isAuthor} = require('../middleware/authenticateUser.js')
// review
router.post('/:id',isLoggedIn, validateReview,wrapAsync( async(req, res,next) => {
    const {review} = req.body; 
    const {id} = req.params;
    review.author = req.user._id
    const newReview = new REVIEW(review);
    const room = await Room.findById(id);
    const result3 = room.reviews.push(newReview);
    await newReview.save();
    const roomSavedReview = await room.save();
    req.flash('success', 'New review Added');

    res.redirect(`/listings/${id}`)

}));

// delete review
router.delete('/:id/review/:reviewId',isLoggedIn,isAuthor,wrapAsync( async(req, res,next)=> {
    const{id, reviewId} = req.params;
    
    await REVIEW.findByIdAndDelete(reviewId);
    const reviewListInRoom = await Room.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    req.flash('success', 'Review deleted');
    res.redirect(`/listings/${id}`);
}));

module.exports = router


