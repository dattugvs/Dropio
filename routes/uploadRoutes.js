var models  = require('../models/schema');
var multer  = require('multer');
var fs = require('fs');
var mkdirp = require('mkdirp');
var dir = '';

var storage = multer.diskStorage({
	destination : (req, file, cb) => {
		var dir = './public/uploads/'+req.params.dropName;
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
		cb(null, dir)},
	filename	: (req, file, cb) => {cb(null, file.originalname)}
});

var upload 	= multer({storage : storage});

module.exports = function(app) {
	app.post('/:dropName', upload.any(), (req, res)=> {
		var files = [];
		for(var i=0; i<req.files.length; i++)
		{
			var temp = {};
			temp['fname'] = req.files[i].originalname;
			files.push(temp);
		}

		models.Drop.findOne({'drop':req.params.dropName}, (err, drop) => {
			if(drop)
			{
				console.log(req.body);
				var json = {};
				if(files.length)
				{
					//files = tfiles;
					json  = {'files':files}
				}
				else if(req.body.notes)
				{
					var title = req.body.notesTitle;
					var notes = req.body.notes;
					var note = {title:title, notes: notes}
					json = {notes : note}
				}
				models.Drop.update({'drop':drop.drop},{$push:json},
					(err, updatedDrop)=>{
						res.redirect('/drop.io/'+req.params.dropName);
					});					
			}
			else
			{
				var newUpload = models.Drop(req.body);
				newUpload.guestsPwd = newUpload.generateHash(req.body.guestsPwd);
				newUpload['files'] = files;
				newUpload.email = 'dattugvs@gmail.com';
				//newUpload.emailPwd = newUpload.generateHash('dattu123');
				newUpload.emailPwd = "dattu123";
				newUpload.save((err, uploadedData) => {
					res.redirect('/drop.io/'+req.params.dropName);
				});
			}
		});
	});
}