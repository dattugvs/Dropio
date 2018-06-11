var express 	= require('express');
var app 		= express();
var passport    = require('passport');
var bodyParser 	= require('body-parser');
var mongoose   	= require('mongoose');
var path	   	= require('path');
var morgan		= require('morgan');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var keys	   	= require('./config/keys');


mongoose.connect(keys.mongodb.dbURI);

mongoose.connection.on('connected', function (err) {
  console.log("Connected to database.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(flash());

app.set('view engine', 'ejs');

app.use(session({ 
	secret: 'dattu123',
    resave: true, 
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/uploadRoutes')(app);
require('./routes/dropRoutes')(app, passport);
require('./routes/gmailRoutes')(app);
require('./routes/fileOpRoutes')(app);
require('./config/passport')(passport);
console.log(3000);
app.listen(3000);