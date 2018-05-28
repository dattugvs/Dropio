var models = require('../models/schema');
var fs = require('fs');

module.exports = function (app)
{
	app.get('/drop.io', (req, res)=> {
		res.render('index');
	});

	app.get('/drop.io/:drop', (req,res)=> {
		models.Drop.findOne({'drop':req.params.drop}, (err, drop)=>{
			if(drop)
				res.render('drop',{drop:drop});
			else
				res.render('404',{'data':{'type':'drop', 'status':'404', 'page_title':'Drop'}});
		});
	});

	app.get('/getFiles/:drop', (req,res)=> {
		models.Drop.findOne({'drop':req.params.drop}, (err, drop)=>{
			if(drop)
				res.send(drop);
			else
				res.redirect('{}');
		});
	});

	app.get('/downloads/:drop/:file', (req,res)=> {
		var drop = req.params.drop;
		var file = req.params.file;
		var path = './public/uploads/'+drop+'/'+file;
		if (fs.existsSync(path))
			res.download(path);
		else
			res.render('404',{'data':{'type':'file', 'status':'404', 'page_title':'Drop File Download'}});
	});

	app.get('/comments/:drop/:id', (req, res)=>{
		var comment = { 'name':req.query.name, 'comment':req.query.comment};
		var type_array_query = req.query.type+"._id";
		var comment_array__query = req.query.type+'.$.comments';

		var q1 = {}, q2 = {};
		q1['drop'] = req.params.drop;
		q1[type_array_query] = req.params.id;
		q2[comment_array__query] = comment;

		console.log(type_array_query+":"+q1[type_array_query]);
		console.log(comment_array__query+":"+q2[comment_array__query]);

		models.Drop.update(q1,{"$push":q2}, (err, updatedDrop)=>{
				if(err)
					res.send(JSON.stringify(err));
				if(updatedDrop)
				{
					console.log("Suckscess");
					console.log(updatedDrop);
				}
			});
		//console.log(req.query.comment);
	});
}