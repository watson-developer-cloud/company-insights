'use strict';

var bluemix  = require('./bluemix'),
    extend   = require('extend');

var services = {

  // http://www.alchemyapi.com/api/register.html
  alchemy_api_key: '<api_key>',

  // PI credentials are automatically loaded for bluemix apps with a bound personality insights service
  // For local testing, get credentials by creating a bluemix app, adding a PI service, and clicking Show Credentials
  // https://console.ng.bluemix.net/
  personality_insights: {
    url:      '<url>',
    username: '<username>',
    password: '<password>',
    version: 'v2'
  },

  // Twitter app credentials: https://apps.twitter.com/app
  twitter: {
    consumer_key:       '<consumer_key>',
    consumer_secret:    '<consumer_secret>',
    access_token_key:   '<access_token_key>',
    access_token_secret:'<access_token_secret>'
  }
};


// Get the service credentials from bluemix if we're
if (process.env.VCAP_SERVICES) {
  services.mongodb = bluemix.serviceStartsWith('mongodb').url;
  services.personality_insights = extend({'version':'v2'}, bluemix.serviceStartsWith('personality_insights'));
}

module.exports = {
  services: services,
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 8080
};
