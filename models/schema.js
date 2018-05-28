var mongoose = require('mongoose');

var dropSchema = mongoose.Schema({
	drop 	   : String,
	password   : String,
	expiry 	   : { type : Date, default: Date.now },
	guests 	   : [String],
	files 	   : [{fname:String, comments:[{name:String, comment : String}]}],
	notes	   : [{title: String, notes: String, comments : [{name:String, comment : String}]}],
	links	   : [{title: String, url : String, comments : [{name:String, comment : String}]}],
	adminPwd   : String
});

var Drop = mongoose.model('Drop', dropSchema);

module.exports = {
	Drop : Drop
};