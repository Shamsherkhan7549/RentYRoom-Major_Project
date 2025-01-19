const Room  = require('../model/schema');
const {REVIEW} = require('../model/reviewSchema');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
        req.flash('error','You must be logged in!')
        res.redirect('/login')
    }
    next()
 };

  module.exports.saveRedirectUrl = (req, res, next)=>{
   
   if(req.session.redirectUrl){
     res.locals.redirectUrl = req.session.redirectUrl;
    
   }
     next()
  };


  module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params;
    const data = await Room.findById(id);
    if(!data.owner.equals(res.locals.currUser._id)){
      req.flash('error', "You are not the owner")
      res.redirect('/listings');
    }

    return next()
  }

  module.exports.isAuthor = async(req, res, next) => {
    const{id, reviewId} = req.params
    const review = await  REVIEW.findById(reviewId)
    const room = await Room.findById(id);
    if(review.author.equals(res.locals.currUser._id)){
      return next()
    };

    req.flash('error', 'You are not the owner')
    res.redirect(`/listings/${id}`);    
  }

  //joi error handling 
  module.exports. validateRooms = (err, req, res, next) => {
      const {error} =  joiSchema.validate(req.body); 
      if(error){
       return next( new ExpressError(404, error.details[0].message))
      }
  }

  module.exports. validateReview = (err,req,res, next) => {
      const {error} = reviewJoiSchema.validate(req.body);
      if(error){
          return next(new ExpressError(404, error.details[0].message))
      }
      return next()
  }