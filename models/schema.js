var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var dropSchema = mongoose.Schema({
	drop 	   : String,
	email	   : String,
	emailPwd   : String,
	expiry 	   : { type : Date, default: Date.now },
	guests 	   : [String],
	guestsPwd   : String,
 	files 	   : [{fname:String, comments:[{name:String, comment : String}]}],
	notes	   : [{title: String, notes: String, comments : [{name:String, comment : String}]}],
	adminEmail : String,
	adminPwd   : String,
	folderName : String
});

// hash the password
dropSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
dropSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var Drop = mongoose.model('Drop', dropSchema);

module.exports = {
	Drop : Drop
};