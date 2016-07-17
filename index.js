var pixel = require('node-pixel');
var five = require('johnny-five');
var forecast = require('./lib/forecast');
var temperature = require('./lib/temperature');
var breath = require('./lib/breath');

var board = new five.Board();
var strip = null;
var mainColor = '#000000';
var numberOfHours = 4;

board.on('ready', function () {
  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [{ pin: 6, length: 128 }]
  });

  strip.on('ready', function () {
    forecast.fetch(function (err, weather) {
      if (err) return console.dir(err);
      var avgTemperature = temperature.average(weather.hourly, numberOfHours);
      mainColor = temperature.mapToColor(avgTemperature);

      setInterval(function () {
        var currentColor = breath.single(mainColor);
        strip.color(currentColor.hex());
        strip.show();
      }, 100); // 10 Hz
    });
  });
});
