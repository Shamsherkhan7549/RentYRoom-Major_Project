const {REVIEW} = require('../model/reviewSchema');
const Room = require('../model/schema');

module.exports.addReview = async(req, res,next) => {
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

};

module.exports.destroyReview =  async(req, res, next)=> {
    const{id, reviewId} = req.params;
    
    await REVIEW.findByIdAndDelete(reviewId);
    const reviewListInRoom = await Room.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    req.flash('error', 'Review deleted');
    res.redirect(`/listings/${id}`);
}