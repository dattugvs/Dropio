var models = require('../models/schema');
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
				res.redirect('/');
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
}