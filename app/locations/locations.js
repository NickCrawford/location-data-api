(function() {

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
		collection.find().limit(500).toArray(function(err, items) {
			if (err) return res.internalError();
			res.send(items);
		});
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
	min = parseInt(req.params.min) || 0;

	console.log("Getting points near Lat: " + lat +" and Long: "+ long + (!req.params.min ? (" within "+max+ " meters") : (" between "+min+" and "+max+" meters")));

	db.collection('porto', function(err, collection) {
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
			
			res.send(items);
		});
	});
};

exports.makeGeo2d =  function(req, res) {
	db.collection('porto', function(err, collection) {
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


}());






