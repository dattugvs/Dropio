var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var dropSchema = mongoose.Schema({
	drop 	   : String,
	expiry 	   : { type : Date, default: Date.now },
	guests 	   : [String],
 	files 	   : [{fname:String, comments:[{name:String, comment : String}]}],
	notes	   : [{title: String, notes: String, comments : [{name:String, comment : String}]}],
	parentDrop : String,
	shared     : [String]
});

var loginSchema = mongoose.Schema({
	drop 		: String,
	guestsPwd   : String,
	adminEmail	: String,
	adminPwd	: String
});

loginSchema.methods.generateHash = function(password) {
	if(password == "")
		return password;
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

loginSchema.methods.validPassword = function(password, type)
{
	if(type == "admin")
  		return bcrypt.compareSync(password, this.adminPwd);
  	else
  	{
  		if(this.guestsPwd == "")
  			return true;
  		return bcrypt.compareSync(password, this.guestsPwd); 
  	}
};

var Drop  = mongoose.model('Drop', dropSchema);
var Login = mongoose.model('Login', loginSchema);

module.exports = {
	Drop  : Drop,
	Login : Login
};