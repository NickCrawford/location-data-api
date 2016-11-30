'use strict';

module.exports = {

  // The world-accessible base URL
  base: 'http://localhost:3000',

  // The port we want the app to run on (override with env.PORT)
  port: 3000,

  // The prefix for our router
  prefix: '/v1.0',

  // Log file (check for errors here)
  log: 'app.log',

  // Database to save users and other data to
  mongo: {
    uri: 'mongodb://localhost:27017/test'
  },

  // Redis is used for caching
  redis: {
    host: '127.0.0.1',
    port: 6379
  },

  // Users to be added to the db upon starting the app. Useful for adding an initial admin
  users: [{
    email: 'user@example.com',
    password: 'password123'
  }],

  // A list of enabled client IDs
  // Clients must use one of these IDs to get a token for a user
  clients: [

  ],

};
