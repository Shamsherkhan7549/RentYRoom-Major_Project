const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./ExpressError/ExpressError');

const reviewRouter = require('./routers/reviewRouter');
const roomRouter = require('./routers/roomRouter');


const app = express();
const port = 8080;

app.set('views', path.join(__dirname,'view'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public/css'));
app.use(express.static('public/js'));

app.use(methodOverride('_method'));

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

app.use('/listings', roomRouter);
app.use('/listings', reviewRouter);

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