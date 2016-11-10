'use strict';

module.exports = function (router) {

	app.get('/locations', locations.findAll);

	/* Near or Circle Queries */
	app.get('/near/:lat,:long/:max?-:min?', locations.near);
	app.get('/near/:lat,:long/:max?', locations.near);
	app.get('/near/:lat-:long', locations.near);

	/* Debug and Tests */
	app.get('/debug/makeGeo2d', locations.makeGeo2d);
}