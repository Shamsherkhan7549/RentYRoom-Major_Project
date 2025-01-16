const express = require('express');
const router = express.Router();
const {reviewJoiSchema} = require('../joiSchema.js');
const {REVIEW} = require('../model/reviewSchema.js');
const wrapAsync = require('../utils/util');
const ExpressError = require('../ExpressError/ExpressError');
const Room = require('../model/schema.js');
const Joi = require('joi');
const {validateReview,isLoggedIn, isAuthor} = require('../middleware/authenticateUser.js');
const review = require('../controller/review.js');

// review
router.post('/:id', validateReview,isLoggedIn,wrapAsync(review.addReview));

// delete review
router.delete('/:id/review/:reviewId',isLoggedIn,isAuthor,wrapAsync(review.destroyReview));

module.exports = router


