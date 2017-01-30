'use strict';

module.exports = function (router) {

	let locations = require('./locations/locations');
	let database = require('./database/database');

	router.get('/locations', locations.findAll);

	/* Near or Circle Queries */
	router.get('/near/:lat,:long/:max?-:min?,:startDate?,:endDate?', locations.near);
	router.get('/near/:lat,:long/:max?,start=:startDate,end=:endDate', locations.near);
	router.get('/near/:lat,:long/:max?-:min?', locations.near);
	router.get('/near/:lat,:long/:max?', locations.near);
	router.get('/near/:lat,:long', locations.near);

	/* Poly Queries */
	router.get('/poly/:coordinates/:startDate?,:endDate?', locations.polygon);

	//router.get('/:db/', database.dbInfo);
	router.get('/:db/:collection/', database.collectionInfo);


	/* Debug and Tests */
	router.get('/debug/makeGeo2d', locations.makeGeo2d);
	router.get('/debug/ls', function(req, res) {res.send("Hello")});
}