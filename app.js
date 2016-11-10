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

// Connect to database
let url = process.env.MONGO_URI || config.mongo.uri;

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server.", db.s.databaseName);
//   datab = db;
// });

// Initialize configuration
configure.app(app, router);

app.get('/', function(req, res) {
	res.send("Welcome to the location data api. For help, check out our <a href='/help'>documentation</a>");
	console.log("Welcome to the location data API. Visit ");
})


var server = app.listen(config.port, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})