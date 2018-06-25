var models  = require('../models/schema');
var AWS 	= require('aws-sdk');
var fs = require('fs');

var multer  = require('multer')
var upload = multer();

AWS.config.loadFromPath('./config/aws-config.json');

module.exports = function(app) {
	app.post('/addfiles', upload.any(),  (req, res)=>
	{
		var files = [];
		console.log(req.files);
		for(var i=0; i<req.files.length; i++)
		{
			var temp = {};
			temp['fname'] = req.files[i].originalname;
			files.push(temp);

			console.log("Uploading : "+req.files[i].originalname);

			/* uploading in s3 */
			var userFolder = 'drop.io' + '/' + req.body.drop;
			var bucket = new AWS.S3({
				params: {
				    Bucket: userFolder
				}
			});

			var contentToPost = {
				Key: req.files[i].originalname, 
				Body: req.files[i].buffer,
				ServerSideEncryption: "AES256", 
			};

			bucket.putObject(contentToPost, function (error, data) {
				if (error)
				{
				    console.log("Error in posting Content [" + error + "]");
				    return false;
				}
				else
				{
				    console.log("Successfully posted Content");
				}
			})
			.on('httpUploadProgress',function (progress) {
				console.log("uploading "+temp['fname']+" " +Math.round(progress.loaded / progress.total * 100) + '% done');
				var json = {};
				if(files.length)
					json  = {'files':files}
				else if(req.body.notes)
				{
					var title = req.body.notesTitle;
					var notes = req.body.notes;
					var note = {title:title, notes: notes}
					json = {notes : note}
				}
				models.Drop.findOne({'drop':req.body.drop}, (err, drop) => 
				{
					var permission = false;
					if(req.user)
					{
						if(req.user.role == "admin")
							permission = true;
					}
					
					if(!permission)
						permission = checkPermission(drop.guests, "addFiles");

					if(!permission)
					{
						req.flash('dropMessage', "Adding Permission Denied !!");
						res.redirect('/drop.io/'+req.body.drop);
					}
					else
					{
						models.Drop.update({'drop':req.body.drop},{$push:json}, (err, updatedDrop)=>
						{
							if(err)
							{
								req.flash('dropMessage', 'Some Error Occured');
								res.redirect('/drop.io/'+req.body.drop);
							}
							console.log(updatedDrop);
							res.redirect('/drop.io/'+req.body.drop);
						});	
					}
				});
			});
		}	
	});
}

function checkPermission (array, permission)
{
	for(var i=0; i<array.length; i++)
		if(array[i] == permission)
			return true;
	return false;
}
