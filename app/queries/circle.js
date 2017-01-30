(function() {

'use strict';

var mongo = require('mongodb');

// var Server = mongo.Server,
// Db = mongo.Db,
// BSON = mongo.BSONPure;
// var collection = null;

// var server = new Server('localhost', 27017, {auto_reconnect: true}),
// db = new Db('porto', server);

// db.open(function(err, db) {
// 	if(!err) {
// 		console.log("Connected to 'local' database", db);
// 		db.collection('points', {strict:true}, function(err, coll) {
// 			if (err) {
// 				console.log("The 'points' collection doesn't exist. Creating it with sample data...");
//                 //populateDB();
//             } else {
//             	//console.log('collection', coll);
//             	collection = coll;
//             }
//         });
// 	}
// });



exports.within = function(req, res) {

}

exports.intersects = function(req, res) {

}

exports.near = function(req, res) {
	var lat = parseFloat(req.params.lat) || 0.0,
	long = parseFloat(req.params.long) || 0.0,
	max = parseInt(req.params.max) || 100,
	min = parseInt(req.params.min) || 0;

	console.log("Getting points near Lat: " + lat +" and Long: "+ long + (!req.params.min ? (" within "+max+ " meters") : (" between "+min+" and "+max+" meters")));

		collection.find({
			"loc" : { 
				$near: {
					$geometry: {
						type: "Point" ,
						coordinates: [ long , lat ]
					},
					$minDistance: min,
					$maxDistance: max

				} 
			}
		}).toArray(function(err, items) {
			console.log("items", items, err);
			res.status(200).json(items);
		});
};


}());






