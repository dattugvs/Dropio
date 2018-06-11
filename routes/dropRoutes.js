var models = require('../models/schema');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function (app, passport)
{
	
	app.get('/', (req,res)=> {
		res.redirect('/drop.io');
	});

	app.get('/drop.io', (req, res)=> {
		res.render('index', {'message':req.flash('signupMessage')});
	});

	app.post('/signup', passportSignup);

	function passportSignup(req,res,next)
	{
		var drop = req.body.drop;
		passport.authenticate('local-signup',
		{
		    successRedirect : '/drop.io/'+drop,
	        failureRedirect : '/drop.io', 
		    failureFlash : true
		})(req,res, next)
	}

	app.post('/login/:drop',  passportLogin);

	function passportLogin(req,res,next)
	{
		var drop = req.params.drop;
		console.log("login:");
		console.log(req.body);
		passport.authenticate('local-login',
		{
		    successRedirect : '/drop.io/'+drop, 
		    failureRedirect : '/drop.io/'+drop, 
		    failureFlash : true 
		})(req,res,next)
	}
	
	app.get('/drop.io/:drop', (req,res)=> 
	{
		models.Drop.findOne({'drop':req.params.drop}, (err, drop) => 
		{
			if(err)
			{
				req.flash('signupMessage', 'Some Error occured !!');
				res.redirect('/drop.io');
			}
			models.Login.findOne({'drop':req.params.drop}, (err, login) => 
			{
				if(err)
				{
					req.flash('signupMessage', 'Some Error occured !!');
					res.redirect('/drop.io');
				}
				if(!drop || !login)
					res.render('404',{'data':{'type':'drop', 'status':'404', 'page_title':'Drop'}});
				else
				{
					var dropAuth = {'drop':req.params.drop};
					if(login['guestsPwd'])
						dropAuth['guest'] = true;
					
					if(login['adminEmail'])
					{
						dropAuth['admin'] = login['adminEmail'];
					}

					var loginReq = false; // login Requirement
					var logout   = false;
					var role = "guest";
					console.log(dropAuth);
					if(req.user)
					{
						if(req.params.drop == req.user.drop || drop['parentDrop'] == req.user.drop) // same drop (no loginReq required)
							role = req.user.role;
						else
							loginReq = true; // other drop (not shared) loginReq may be required
					}
					else // not logged in... loginReq may require
						loginReq = true;

					if(loginReq) // loginReq may be required
					{
						if(!dropAuth['admin'] && !dropAuth['guest']) // no credentials -> no loginReq;  drop open as guest
							loginReq = false;	// no loginReq requirement	
					}

					if(req.user)
						logout = true;

					if(loginReq)
						res.render('login', {data:dropAuth, message:req.flash('loginMessage')});
					else
						res.render('drop',{'drop':JSON.stringify(drop), 'role':role, 'dropAuth':dropAuth, 'logout':logout});
				}
			});
		});
	});

	app.post('/saveLogin/:drop', (req, res) => 
	{
		var tempLogin = models.Login();
		
		if(req.body.guestsPwd)
			req.body.guestsPwd = tempLogin.generateHash(req.body.guestsPwd);
		else if(req.body.adminPwd)
			req.body.adminPwd = tempLogin.generateHash(req.body.adminPwd);
		
		models.Login.update({'drop':req.params.drop}, {"$set": req.body}, (err, updatedLogin) => 
		{
			if(err)
				res.end("error");
			if(req.body.guests)
			{
				models.Drop.update({'drop':req.params.drop}, {"$set": req.body}, (err, updatedDrop) =>
				{
					if(err)
						res.end("error");
					if(updatedDrop)
					{
						console.log(updatedDrop);
						res.redirect('/drop.io/'+req.params.drop);
					}
				});
			}	
			else 
				res.redirect('/drop.io/'+req.params.drop);
		});
	});

	app.get('/drop.io/:drop/logout', (req,res)=>{
		req.logout();
		res.redirect('/drop.io/'+req.params.drop);
	});
}

function getHash(password)
{
	bcrypt.hash(password, (err,hash) => {
  		if(err)
  			return(password);
  		console.log(hash);
  		return hash;
	});
}
