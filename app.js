var express 	= require('express');
var app 		= express();

var bodyParser 	= require('body-parser');
var mongoose   	= require('mongoose');
var path	   	= require('path');
var morgan		= require('morgan');
var keys	   	= require('./config/keys');

mongoose.connect(keys.mongodb.dbURI);

mongoose.connection.on('connected', function (err) {
  console.log("Connected to database.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.set('view engine', 'ejs');

require('./routes/uploadRoutes')(app);
require('./routes/dropRoutes')(app);
require('./routes/routes')(app);
require('./routes/gmailRoutes')(app);

console.log(4000);
app.listen(4000);