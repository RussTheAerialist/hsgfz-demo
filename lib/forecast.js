var Forecast = require('forecast');
var apikey = require('../.api_key.json');
var position = require('../.position.json');

var forecast = new Forecast({
  service: 'forecast.io',
  key: apikey,
  units: 'f',
  cache: true,
  ttl: {
    minutes: 15
  }
});

forecast.fetch = function (func) {
  this.get(position, func);
};

module.exports = forecast;
