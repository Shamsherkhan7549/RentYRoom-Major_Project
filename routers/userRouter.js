const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/util');
const USER = require('../model/userSchema');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware/authenticateUser.js')
const user = require('../controller/user.js');

router.route('/signup')
.get(user.signup)
.post(wrapAsync(user.addUser))

//login route
router.route('/login')
.get(user.login)
.post(saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),
        user.loginUser
    )

//logout route
router.get('/logout', user.logoutUser);

module.exports = router