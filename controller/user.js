const USER = require('../model/userSchema');
module.exports.signup = (req, res)=>{
    res.render('signUp.ejs')
};

module.exports.addUser = async(req, res)=>{
   try{
    const {username, email, password} = req.body;
    const user = new USER({username, email})

    let userRegitered = await USER.register(user, password);
    req.login(userRegitered, (err) => {
        if(err){
            return next(err)
        };
        req.flash('success', 'Welcome to RentYRoom')
        res.redirect('/listings');
    });
   }catch(error){
    req.flash('error', error.message);
    res.redirect('/signup')
   }
};

module.exports.login = (req, res)=>{
    res.render('login.ejs')
};

module.exports.loginUser = async(req, res) => {
    if(res.locals.redirectUrl){
    res.redirect(res.locals.redirectUrl);
}else{
    res.redirect('/listings')
}
};

module.exports.logoutUser = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }

        req.flash('error', 'You logged out!')
        res.redirect('/listings');
    });
   
}