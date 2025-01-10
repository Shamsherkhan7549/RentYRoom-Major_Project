const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/util');
const ExpressError = require('../ExpressError/ExpressError');
const Joi = require('joi');
const USER = require('../model/userSchema');
const passport = require('passport');

router.get('/user/signup', (req, res)=>{
    res.render('signUp.ejs')
});

router.post('/signup', wrapAsync(async(req, res)=>{
   try{
    const {username, email, password} = req.body.user;

    const user = new USER({username, email})

    let userRegitered = await USER.register(user, password);

    req.flash('success', 'Welcome to RentYRoom')
    res.redirect('/listings');

   }catch(error){
    req.flash('success', error.message);
    res.redirect('/signup')
   }
}));

//login route

router.get('/user/login', async(req, res)=>{
    res.render('login.ejs')
})

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }),
    function(req, res) {
      res.redirect('/listings');
    });

module.exports = router