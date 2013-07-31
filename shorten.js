var shortId = require('shortId')
, url_pattern = new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?", "i")
, fs = require('fs')
, mongoose  =require('mongoose');

mongoose.connect('mongodb://localhost/short');


var smallLinks = new mongoose.Schema({
  id: { type: String, index: true }
, url: String
, created: Date
, accessed: Date
, count: Number
});

var Small = mongoose.model('Link', smallLinks);

function small(url) {
	console.log("Shortening " + url);
	var result = new Object();
	shortId.seed(1625);

	//Checks url for http or not
	if (url_pattern.exec(url) == null) {
		url = "http://" + url;
	}

	//creates unique ID
	// In rare circumstances it will overrite an old ID
	// In which case that one will be removed from database (tofix);
	var id = shortId.generate();

	var toAdd = new Small;
	toAdd.id = id;
	toAdd.url = url;
	toAdd.created = new Date;
	toAdd.accessed = new Date;
	toAdd.count = 0;

	toAdd.save();
	console.log("Saving "+id);
	return id;
}

//Find a URL based off the key
function find(id){
	 Small.findOne({"url": req.params.url}, function (err, data) {
  	var forward = data;
  	  if(!err){
	     console.log("Redirecting to " + forward);
	     res.redirect(forward);
      	}
      });

}

exports.small = small;
exports.find = find;

