const express = require('express');
const app = express();
const port = 5000;
const bodyparser = require('body-parser')
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config()

const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser')

var Publishable_Key = "pk_test_51Ji4aeSBVcghPSzlDghpN8ceaD6XM2giidfcYyOglDAPLxwQrYRRWTZxeaILbxoLP74CqRRuJlCZSXDnRQsEC0J000jrl3CeaM"
var Secret_Key = "sk_test_51Ji4aeSBVcghPSzlubPyKiYcmkiUxobNngXNBlsbynsMKex57DpnrDeiUvfAhTbGJEkFUhA2BQt8n5wPEa3lxW1900PVsRW97b"

const stripe = require('stripe')(Secret_Key)


const passport = require('passport');
const passportLocal  = require('./config/passportlocal')
const db = require('./config/mongoose');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use(expressLayouts);

app.set('layout extractStyles' , true);
app.set('layout extractScripts', true);

app.set('view engine' ,'ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('views','./views');


app.use(cookieParser('secret'));
app.use(session({
    secret : 'secret',
    maxAge : (1000 * 60 * 100),
    resave : false,
    saveUninitialized :false,
}));



app.use(bodyparser.urlencoded({extended : true}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());   
app.use(customMware.setFlash);

app.use(express.static('./asset'));
app.use('/public', express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))); // IMP css
app.use('/uploads', express.static(process.cwd() + '/uploads')) //IMP images


app.get('/home/:price', function(req, res,next){
	res.render('home', {
	key: Publishable_Key,
    price : req.params.price
	})

    next();
})

app.post('/payment', function(req, res){

	res.render('success');
	
})

app.use('/' ,require('./routes'));

app.listen(port , function(err){
    if(err)
    {
        console.log(`Error in running server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});