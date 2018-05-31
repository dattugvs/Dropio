var nodemailer = require('nodemailer');
var fs = require('fs');
var transporter;

module.exports = function (app)
{
	app.post('/sendFiles/:drop', (req,res) => {

		var attachments = [];
		var filenotfound = [];
		console.log(req.body);
		var files = JSON.parse(req.body.files);
		for(var i=0; i<files.length; i++)
		{
			var fname = files[i];
			var path = './public/uploads/'+req.params.drop+'/'+fname;
			if (fs.existsSync(path))
			{
				attachments.push({'filename':fname, 'path':path});
			}
			else
			{
				filenotfound.push(fname);
				console.log(fname+": not filenotfound");
			}
		}
		if(attachments.length)
		{
			var mailOptions = {
			  from: 'dattugvs@gmail.com',
			  to: req.body.to,
			  subject: 'Drop '+req.params.drop+' files',
			  text : 'Drop Files Shared to email. Ignore this email if this doesn\'t belong to you',
			  attachments : attachments
			};
			resp = sendMail(mailOptions);
			if(resp == "error")
				res.end("error");
			else
				res.end(resp);

		}		
	});
}

function sendMail(mailOptions)
{
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'dattugvs@gmail.com',
	    pass: 'dattu123'
	  }
	});
	transporter.sendMail(mailOptions, function(error, info){
	  	if (error)
	  	{
	    	console.log(error);
	    	return "error";
	  	}
	  	else
	  	{
	    	console.log('Email sent: ' + info.response);
	    	return info.response;
	  	}
	});
}