module.exports = function (app) {
	app.get('/', (req,res)=> {
		res.redirect('/drop.io');
	});

	app.get('/logout', (req,res)=>{
		res.logout();
		res.redirect('/drop.io');
	});
}