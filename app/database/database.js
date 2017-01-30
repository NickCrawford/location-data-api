(function() {

'use strict';

var mongo = require('mongodb');
var Server = mongo.Server,
Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});


exports.dbInfo = function(req, res) {
	
};

exports.collectionInfo = function(req,res) {
	//res.send("Info for db: " + req.params.db + " collection: " + req.params.collection);

	var db = new Db(req.params.db, server);

	db.open(function(err, db) {
		if(!err) {
			db.collection(req.params.collection, {strict:true}, function(err, result) {
				if (err) {
					res.send(err);
	            } else {
	            	console.log(result);
	            	res.send(result);
	            }
	        });
		}
	});

	db.close();
};


})();