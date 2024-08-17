const express = require('express');
const app = express() //instance
const path = require('path');
const mongoose = require('mongoose');
const seedDB = require('./seed');
const ejsmate=require('ejs-mate');
const methodOverride = require('method-override');
const flash=require('connect-flash');
const passport = require('passport');
const session=require('express-session');
const LocalStrategy = require('passport-local');
const User = require('./models/User');


const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart')



mongoose.connect('mongodb://127.0.0.1:27017/julybatch') //returns a promise
.then(()=>{console.log("DB connected")})
.catch((err)=>{console.log("Error is: " , err)})

let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true ,
        expires: Date.now() + 24*7*60*60*1000 , 
        maxAge:24*7*60*60*1000
    }
}

app.engine("ejs",ejsmate);
app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views'))
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.urlencoded({extended:true})) //form data body parser
app.use(methodOverride('_method'))
app.use(session(configSession));
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// seedDB() //baar baar store hojaega if not commented

// PASSPORT WAALI
passport.use(new LocalStrategy(User.authenticate()));

app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);

const PORT = 8080;
app.listen(PORT , ()=>{
    console.log(`Server running at port : ${PORT}`)
})

// 1. basic Server
// 2. mogoose conection
// 3. model -> seed data
// 4. routes -> views
// 5.

