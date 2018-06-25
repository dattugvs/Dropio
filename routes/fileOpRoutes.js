var models = require('../models/schema');
var mongoose = require('mongoose');
var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/aws-config.json');

var s3 = new AWS.S3();

module.exports = function (app)
{
	app.get('/downloads/:drop/:file', (req,res, next)=> 
	{
		var downloadFile = false;
		if(!req.user)
			res.redirect('/drop.io/'+req.params.drop);
		else
		{
			if(req.user.role == "admin")
				downloadFile = true;
			else
				downloadFile = checkPermission(req.user.guests, "downloads");
			if(!downloadFile)
			{
				req.flash('dropMessage', 'Download Permission Denied !!');
				res.end("error");
			}
			else
			{
				var urlParams = {Bucket: 'drop.io', Key: req.params.drop+"/"+req.params.file, Expires: 10};
				s3.getSignedUrl('getObject', urlParams, function(err, url){
				  	console.log('url :', url);
				  	s3.getObject({Bucket: 'drop.io', Key: req.params.drop+"/"+req.params.file}, function(err, data) {
					    if (err)
					        res.send("error")
					    else
					    	res.send(url);
					});
				});
			}
		}
		
	});

	app.post('/comments/:drop/:id', (req, res)=>
	{
		models.Drop.findOne({'drop':req.params.drop}, (err, drop) => 
		{
			if(err)
			{
				req.flash('dropMessage', 'Some Error Occured');
				res.end("error");
			}
			if(!drop)
				res.redirect('/404/drop');
			else
			{
				var permission = false;
				if(req.user)
				{
					if(req.user.role == "admin")
						permission = true;
				}
				
				if(!permission)
					permission = checkPermission(drop.guests, "comments");
				
				if(permission)
				{
					var id = mongoose.Types.ObjectId();
					var comment = { 'name':req.body.name, 'comment':req.body.comment, '_id':id};
					var type_array_query = req.body.type+"._id";
					var comment_array__query = req.body.type+'.$.comments';

					var q1 = {}, q2 = {};
					q1['drop'] = req.params.drop;
					q1[type_array_query] = req.params.id;
					q2[comment_array__query] = comment;

					models.Drop.update(q1,{"$push":q2}, (err, updatedDrop)=>
					{
						console.log(updatedDrop);
						if(updatedDrop.nModified == 1)
						{
							data = {'id':id};
							res.end(id.toString());
						}
						else
							res.end("fail");
						if(err)
							res.end("error");
					});
				}
				else
				{
					req.flash('dropMessage', "Comment Permission Denied !!");
					res.end("permission");
				}	
			}
		});
	});

	app.post('/delete/:drop', (req, res)=>
	{
		if(req.body.type)
		{
			var searchbytype = req.body.type+"._id";
			var query1 = {}, query2 = {};

			query1['drop'] =  req.params.drop;
			query1[searchbytype] =  req.body.typeId;

			var commquery = req.body.type+".$.comments";
			var temp = {'_id':req.body.commentId};
			query2[commquery] = temp;
		}
		else if(req.body.fname)
		{
			var query1 = {'drop':req.params.drop};
			var query2 = {'files':{'fname':req.body.fname}};
			fs.unlink('./public/uploads/'+req.params.drop+'/'+req.body.fname, (err) =>
			{
			  	if(err)
			  	{
			  		console.log("\nerror in file delete\n");
			  		res.end("fail");
			  	}
			  	else
			  	{
			  		console.log('successfully deleted'+req.params.drop+'/'+req.body.fname);
			  	}
			});
		}
		else
		{
			var query1 = {'drop':req.params.drop};
			var query2 = {'notes':{'_id':req.body.id}};
		}

		models.Drop.findOne({'drop':req.params.drop}, (err, drop) => 
		{
			if(err)
			{
				req.flash('dropMessage', "Some Error");
				res.end("error");
			}
			if(!drop)
				res.render('404',{'data':{'type':'drop', 'status':'404', 'page_title':'Drop'}});
			else
			{
				var permission = false;
				if(req.user)
				{
					if(req.user.role == "admin")
						permission = true;
				}
				
				if(!permission)
					permission = checkPermission(drop.guests, "comments");
				if(!permission)
				{
					req.flash('dropMessage', "Delete Permission Denied !!");
					res.end("permission");
				}
				else
				{
					models.Drop.update(query1, {$pull:query2}, (err, updatedDrop) => 
					{
						console.log(updatedDrop);
						if(err)
							res.end("error");
						if (updatedDrop.nModified == 1)
						{
							if(req.body.type)
								res.end("comments");
							else
								res.end("success");
						}
						else
							res.end("fail");
					});
				}

			}
		});
	});	
}

function checkPermission (array, permission)
{
	for(var i=0; i<array.length; i++)
		if(array[i] == permission)
			return true;
	return false;
}