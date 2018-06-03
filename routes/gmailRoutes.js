var models = require('../models/schema');
var fs = require('fs');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
module.exports = function (app)
{
	app.post('/shareFiles/:drop', (req,res) => {

		var attachments = [];
		var filenotfound = [];
		console.log(req.body);
		req.body.files = JSON.parse(req.body.files);
		req.body.guests = JSON.parse(req.body.guests);
		console.log(req.body);
		var id = mongoose.Types.ObjectId();
		req.body['drop'] = id.toString();
		req.body['folderName'] = req.params.drop;
		var url = 'http://localhost:4000/drop.io/'+id.toString();
		
		var text = 'This sharable link redirects to shared files from the drop named '+req.params.drop+':\n\n'+url
		var mailOptions = {
			from: 'dattugvs@gmail.com',
			to: req.body.to,
			subject: 'Drop files shared',
			text: text
		};

	  	var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'dattugvs@gmail.com',
		    pass: 'dattu123'
		  }
		});

		var newUpload = models.Drop(req.body);
		newUpload.save((err, uploadedData) => 
		{
			if(err)
				res.end("error");
			else
				{
					console.log(url);
					transporter.sendMail(mailOptions, function(error, info)
					{
		  				if(error)
		  				{
		    				console.log(error);
		    				res.end("error");
		  				}
		  				if(info)
		  				{
		    				console.log('Email sent: ' + info.response);
		    				res.end(url);
		  				}
					});				
				}
		});
	});
}