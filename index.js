var pixel = require('node-pixel');
var five = require('johnny-five');
var forecast = require('./lib/forecast');
var temperature = require('./lib/temperature');

var board = new five.Board();
var strip = null;
var status = false;
var mainColor = '#000000';
var numberOfHours = 4;

forecast.fetch(function (err, weather) {
  if (err) return console.dir(err);
  var avgTemperature = temperature.average(weather.hourly, numberOfHours);
  mainColor = temperature.mapToColor(avgTemperature);
  console.log(mainColor);
});

board.on('ready', function () {
  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [{ pin: 6, length: 128 }]
  });

  strip.on('ready', function () {
    setInterval(function () {
      if (status) {
        strip.color(mainColor);
      } else {
        strip.color('#000000');
      }
      strip.show();
      status = !status;
    }, 500); // 1Hz 50/50 duty cycle
  });
});
