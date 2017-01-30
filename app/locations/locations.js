(function() {

'use strict';

var mongo = require('mongodb');

var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;
var collection = null;
let log = require('../helpers/logger');


var server = new Server('localhost', 27017, {auto_reconnect: true}),
db = new Db('porto', server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'local' database", db);
		db.collection('points', {strict:true}, function(err, coll) {
			if (err) {
				console.log("The 'points' collection doesn't exist. Creating it with sample data...");
                //populateDB();
            } else {
            	//console.log('collection', coll);
            	collection = coll;
            }
        });
	}
});

exports.findAll = function(req, res) {
	console.log(collection);
		collection.find().limit(500).toArray(function(err, items) {
			if (err) return res.internalError();
			res.send(items);
		});
};


// GET https://localhost:8081/near/lat,long/max?-min?
/** 
 * Queries the database using a single point and a radius. aka a 'circle' query
 * 
 * @param {float} lat - Latitude of the query point
 * @param {float} long - Longitude of the query point
 * @param {(double|integer)} [max] - (Optional) The maximum radius around the point to query for
 * @param {(double|integer)} [min] - The minimum radius from the origin point to query for.
 */
exports.near = function(req, res) {
	var lat = parseFloat(req.params.lat) || 0.0,
	long = parseFloat(req.params.long) || 0.0,
	max = parseInt(req.params.max) || 100,
	min = parseInt(req.params.min) || 0,
	startDate = new Date().setTime(req.params.startDate) || new Date(Date.UTC(1970,0,0,0,0,0)),
	endDate = new Date().setTime(req.params.endDate) || new Date();

	startDate = startDate.toISOString();

	console.log(startDate + " - " + endDate+"Getting points near Lat: " + lat +" and Long: "+ long + (!req.params.min ? (" within "+max+ " meters") : (" between "+min+" and "+max+" meters")));

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
			// ,
			// "DateTime": {
			// 	$gte: startDate,
			// 	$lte: endDate
			// }
		}).toArray(function(err, items) {
			console.log("Found " + items.length + " items", err);
			res.status(200).json(items);
		});
};

exports.polygon = function(req, res) {
	var coordString = req.params.coordinates;

	var coordinatesAll = coordString.split(',');
	var coordinates = [];
	for (var i = coordinatesAll.length - 1; i >= 0; i-=2) {
		coordinates.push([parseFloat(coordinatesAll[i]), parseFloat(coordinatesAll[i-1])]);
	}
	for (var i = coordinates.length - 1; i >= 0; i--) {
		console.log(coordinates[i]);
	}
	console.log(coordinates);
	collection.find({
		"loc" : { 
			$geoWithin: {
				$geometry: {
					type: "Polygon",
					coordinates: [coordinates]
				}
			} 
		}
		// ,
		// "DateTime": {
		// 	$gte: startDate,
		// 	$lte: endDate
		// }
	}).toArray(function(err, items) {
		console.log("Found " + items + " items", err);
		res.status(200).json(items);
	});
}

exports.makeGeo2d =  function(req, res) {
	db.collection('points', function(err, collection) {
		collection.find({ "loc" : { $exists : false} }, 
			function(err, resultCursor) {
				function processItem(err, doc) {
					if(doc === null) {
      					return; // All done!
  					}

		  					// console.log(doc);
					var loc = {};
					loc.type = "Point";
					loc.coordinates = [ doc.Longitude , doc.Latitude ];
					doc.loc = loc;
				    // deletes the previous value
				    delete doc.Latitude;
				    delete doc.Longitude;

			        //Save and return result
			        collection.save(doc);
			        console.log(doc.ID);

  					setTimeout(function(err) {
  						resultCursor.nextObject(processItem);
  					}, 0);
				}

				resultCursor.nextObject(processItem);
			})
	});
	
};

exports.ls = function(req, res) {
	log.info("Points to Line String");

	var cursor = collection.find();



	// Execute the each command, triggers for each document
	cursor.each(function(err, item) {

		// If the item is null then the cursor is exhausted/empty and closed
		if(item == null) {

			// Show that the cursor is closed
			cursor.toArray(function(err, items) {
				assert.ok(err != null);

				// Let's close the db
				db.close();
			});
		};
	});
}


exports.pointsToLineStrings = function(req, res) {
	console.log("points to line string");
	db.collection('points', function(err, collection) {
		collection.find({ "loc" : { type : "Point"} }, function(err, resultCursor) {
			var currentTripID = 0;
			var coordinates = [];
			var toDelete = [];
			var loc = {};

			function processItem(err, doc) {
				console.log(doc);
				if(doc == null) {
  					return; // All done!
				}

				if (doc.TripID == currentTripID) {
					console.log(doc.TripID);

					loc.type = "LineString";
					coordinates.push([ doc.Longitude , doc.Latitude ]);
				} else {

					loc.type = "LineString";
					doc.loc = loc;
					doc.loc.coordinates = coordinates;
				    // deletes the previous value
				    // delete doc.Latitude;
				    // delete doc.Longitude;

				    console.log("saving::: ");
				    console.log(doc);
			        //Save and return result
			        db.collection('lines', function(err, collec) {
			        	collec.save(doc);
			        });
			        setTimeout(function(err) {
  						resultCursor.nextObject(processItem);
  					}, 0);
				}
			}

			setTimeout(function(err) {
				resultCursor.nextObject(processItem);
			}, 0);
		})
	});
};


}());






