var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var dropSchema = mongoose.Schema({
	drop 	   : String,
	expiry 	   : { type : Date, default: Date.now },
	guests 	   : [String],
 	files 	   : [{fname:String, comments:[{name:String, comment : String}]}],
	notes	   : [{title: String, notes: String, comments : [{name:String, comment : String}]}],
	folderName : String,
	shared     : [String]
});

var loginSchema = mongoose.Schema({
	drop 		: String,
	guestsPwd   : String,
	adminEmail	: String,
	adminPwd	: String
});

loginSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

loginSchema.methods.validPassword = function(password, type)
{
	if(type == "adminPwd")
  		return bcrypt.compareSync(password, this.adminPwd);
  	else
  		return bcrypt.compareSync(password, this.guestsPwd); 
};

var Drop  = mongoose.model('Drop', dropSchema);
var Login = mongoose.model('Login', loginSchema);

module.exports = {
	Drop  : Drop,
	Login : Login
};