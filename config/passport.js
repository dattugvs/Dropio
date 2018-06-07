var LocalStrategy   = require('passport-local').Strategy;
var models          = require('../models/schema');

module.exports = function (passport) {

	passport.serializeUser(function(req, user, done) {
		if(req.body.email == "guest")
	       role = "guest";
	    else
	        role = "admin";
        done(null, user.id+" "+role);
    });

	passport.deserializeUser(function(req, idwithRole, done) {
		var id = {'_id': idwithRole.split(' ')[0] };
		var role = idwithRole.split(' ')[1];
		models.Drop.findById(id, function(err, user) {	
        	user.role=role;
        	done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'drop',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, drop, password, done) {
    	process.nextTick(function()
    	{
			var newUpload = models.Drop(req.body);
			newUpload.save((err, drop) =>
			{
				if(err)
					return done(null, false, req.flash('signupMessage', 'Some Error occured !!'));
				console.log(req.body.guestsPwd == "");
				if(req.body.guestsPwd == "" || req.body.guestsPwd)
				{
					var newLogin = models.Login(req.body);
					console.log(newLogin);
					newLogin.save((err, logindetails) =>
					{
						if(err)
							return done(null, false, req.flash('signupMessage', 'Some Error occured !!'));
					});
				}
				return done(null, drop, req.flash('signupMessage', 'Drop created successfully'));
			});
		});
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
    	process.nextTick(function() {
    		var query = {'drop':req.params.drop};
    		var msg;
    		console.log("pssport-login:");
    		console.log(req.body);
    		if(email == "guest")
    		{
    			 msg = "success guest";
    			// query['guestsPwd'] = password;
    		}
    		else
    		{
    			msg = "success admin";
    			// query['adminEmail'] = email;
    			// query['adminPwd']   = password;
    		}
    		// console.log(query);
    		models.Drop.findOne(query, (err, drop) =>
    		{
    			if(err)
    				return done(null, false, req.flash('loginMessage', 'Some Error occured !!'));
    			else if(drop)
    			{
    				return done(null, drop, req.flash('loginMessage', msg));
    			}
    			else
    				return done(null, false, req.flash('loginMessage', 'Invalid Details !!'));	
    		});
    	});
	}));
};
