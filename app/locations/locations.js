'use strict';

var mongo = require('mongodb');

var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true}),
db = new Db('local', server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'local' database");
		db.collection('porto', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'porto' collection doesn't exist. Creating it with sample data...");
                //populateDB();
            }
        });
	}
});

exports.findAll = function(req, res) {
	db.collection('porto', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.findNearPoint = function(req, res) {
	var lat = parseFloat(req.params.lat) || 0,
	long = parseFloat(req.params.long) || 0,
	dist = parseInt(req.params.dist) || 100;

	//res.send("Getting points near Lat: " + lat +" and Long: "+ long + " within "+dist+ " meters");
	console.log("Getting points near Lat: " + lat +" and Long: "+ long + " within "+dist+ " meters");

	db.collection('porto', function(err, collection) {
		collection.find({
			"loc" : { 
				$near: {
					$geometry: {
						type: "Point" ,
						coordinates: [ long , lat ]
					},
					//$minDistance: 0,
            		$maxDistance: dist

				} 
			}
		}).toArray(function(err, items) {
			console.log(items);
			res.send(items);
		});
	});
};
