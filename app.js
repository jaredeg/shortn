/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    shortId = require('shortid'),
    app = express(),
    url_pattern = new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?", "i"),
 	mongoose  =require('mongoose'),
 	db = mongoose.connect('mongodb://localhost/short'),
 	Schema =  mongoose.Schema;

var smallLinks = new Schema({
	id: { type: String, index: true },
	url: { type: String, index: true },
	created: { type: Date, default: Date.now },
	accessed: { type: Date, default: Date.now },
	count: { type: Number, default: 0 }
});

var Small = mongoose.model('Link', smallLinks);
shortId.seed(1625);

// all environment
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.enable("view cache");
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);



// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get("/", function(req, res){
	console.log('Showing Main Page');

	res.render("index", { title: "Shorten them URLS" });
});

app.get('/about', function(req, res) {
	res.render('about', {
		title: 'About'
	})
});


app.get('/shorten', function(req, res) {
	console.log('Shortening url...');
	var url = req.param('url');	
	//Checks url for http or not
	if (url_pattern.exec(url) === null) {
		url = "http://" + url;
	}

	var id = shortId.generate();

	var toAdd = new Small();
	toAdd.id = id;
	toAdd.url = url;

	Small.findOne({"url": url}, function (err, data) {
  	  if(err || data === null){
  	  	toAdd.save(function(err){
			if (err){
	     	 console.log("Could not save");
	     	 res.send('there was an error');
			} else{
	  		 console.log("Saving new entry");
	     	 res.send(id);
	  		}});
      } else {
         res.send(data.id);
      	}
	});
});

app.get('/:id', function(req, res){
	console.log(req.params.id);

  	Small.findOneAndUpdate({"id": req.params.id}, {accessed: new Date(), $inc: { count: 1 } }, function (err, data) {
  		if(err || data === null){
  	  		console.log("Bad Link: " +data);
  	  		res.send(404);
      	} else {
         console.log("Redirecting to " + data);
	     res.redirect(data.url);
      	}
   	});
});

/**


app.get(/\/users\/(\d*)\/?(edit)?/, function (req, res){
	// /users/10
	// /users/10/
	// /users/10/edit

	var message = "user #" + req.params[0] + "'sprofile";
	if (req.params[1] === 'edit') {
		message = "Editing " + message;
	} else {
		message = "Viewing " + message;
	}
	res.send(message);

});
**/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});