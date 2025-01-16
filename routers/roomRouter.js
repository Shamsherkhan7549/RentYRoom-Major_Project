const express = require('express');
const router = express.Router();
const Room = require('../model/schema');
const wrapAsync = require('../utils/util');
const ExpressError = require('../ExpressError/ExpressError');
const {joiSchema} = require('../joiSchema');
const Joi = require('joi');
const passport = require('passport');
const {isLoggedIn, isOwner, validateRooms} = require('../middleware/authenticateUser');
const room = require('../controller/room');
const multer  = require('multer');
const {storage} = require('../cloud.config.js')
const upload = multer({ storage})


router.route('/')
.get(wrapAsync(room.index))
.post(validateRooms,isLoggedIn,upload.single('listing[image]'), wrapAsync(room.addRoom));

router.get('/new', isLoggedIn, wrapAsync(room.newRoom));

router.route('/:id')
.get( wrapAsync(room.itemDetail))
.put(isLoggedIn, validateRooms,isOwner, wrapAsync(room.editRoom))
.delete(isLoggedIn,wrapAsync(room.deleteRoom))

router.get('/:id/edit', isLoggedIn, wrapAsync(room.edit))

module.exports = router