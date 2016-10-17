'use strict';

/*
Location Data RESTful API
@author Nick Crawford
*/

/* 
This function allows us to use require() as if we
are already in the root of our application.
As our project directory structure grows deeper,
this prevents annoying relative path require calls like:
var Article = require('../../../models/article');
*/
GLOBAL.rootRequire = function(name) {
    return require(__dirname + '/' + name);
};

let express = require('express');
let mongoose = require('mongoose');
let fs = require("fs");

let configure = require('./app/helpers/configure');
let config = require('./app/config/config');

//Make our application
let app = express();
let router = express.Router();

// Connect to database
let mongo = process.env.MONGO_URI || config.mongo.uri;
mongoose.connect(mongo);

// Initialize configuration
configure.app(app, router);

app.get('/', function(req, res) {
	res.send("Hello World");
	console.log("Welcome to the location data API");
})

app.get('/location', function (req, res) {
	var query = Akron.findOne({ 'name.last': 'Ghost' });

	// selecting the `name` and `occupation` fields
	//query.select('name occupation');

	// execute the query at a later time
	query.exec(function (err, data) {
	  if (err) return handleError(err);
	  console.log(data);
	})

})

app.get('/intersects/:region', function(req, res) {
	console.log("Getting information within the region " + req.params.region);
  res.send("Getting information within the region " + req.params.region);
});

app.get('/near/:point', function(req, res) {
  res.send("Getting information near " + req.params.point);
});

app.get('/test', function(req,res){
	//http://server/test?points=foo,bar


	var points = req.query.points.split(',');
    console.log(points);

    res.status(200).send(points);
});

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})