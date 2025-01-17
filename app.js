if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./ExpressError/ExpressError');
const session = require('express-session');
const flash = require('connect-flash')
const reviewRouter = require('./routers/reviewRouter');
const roomRouter = require('./routers/roomRouter');
const userRouter = require('./routers/userRouter')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const USER = require('./model/userSchema');



const app = express();
const port = 8080;

const sessionOption = {
    secret:'mysecretcode',
    resave:false,
    saveUninitialized:true,
   cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
   }
};

app.set('views', path.join(__dirname,'view'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(methodOverride('_method'));
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(USER.authenticate()))
passport.serializeUser(USER.serializeUser());
passport.deserializeUser(USER.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})
app.engine('ejs', ejsMate);

//server
main().then(result=>{
    console.log('mongoose is working')
}).catch(error=>{
    console.log("some error found in mongoose", error)
});

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/RentYRoom')
};


app.get('/', ((req, res)=>{
    res.send('HI , I AM ROOT ROUTE OF RentYRoom')
}));

app.get('/demo', async(req, res)=>{
    let fakeuser = new USER({
        email:'abc@gmail123.com',
        username:'Shamsher76',
    });

    let registeredUser = await USER.register(fakeuser, 'hello');
    res.send(registeredUser)
});

app.use('/listings', roomRouter);
app.use('/listings', reviewRouter);
app.use('/', userRouter);

app.all('*', (req, res, next) =>{
    next(new ExpressError(404, 'Page not found!'))
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    const {name, status = 400, message = 'Something went wrong!'} = err;
    res.status(status).render('error.ejs',{name, status, message});
});

app.listen(port, (req, res)=>{
    console.log(`server listening on port ${port}`)
});