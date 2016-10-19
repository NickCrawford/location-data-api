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
let fs = require("fs");

let configure = require('./app/helpers/configure');
let config = require('./app/config/config');

//Make our application
let app = express();
let router = express.Router();

var locations = require('./app/locations/locations');

app.get('/locations', locations.findAll);

//app.get('/near/:lat-:long', this.findByPoint);
app.get('/near/:lat,:long/:max?-:min?', locations.findNearPoint);
app.get('/near/:lat,:long/:max?', locations.findNearPoint);
app.get('/near/:lat-:long', locations.findNearPoint);
app.get('/debug/makeGeo2d', locations.makeGeo2d);
// Connect to database
let url = process.env.MONGO_URI || config.mongo.uri;
// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');




// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server.", db.s.databaseName);
//   datab = db;
// });

// Initialize configuration
configure.app(app, router);

app.get('/', function(req, res) {
	res.send("Hello World");
	console.log("Welcome to the location data API");
})

app.get('/intersects/:region', function(req, res) {
	console.log("Getting information within the region " + req.params.region);
  	res.send("Getting information within the region " + req.params.region);
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