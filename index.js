var pixel = require('node-pixel');
var five = require('johnny-five');
var forecast = require('./lib/forecast');
var temperature = require('./lib/temperature');
var weather = require('./lib/weather');
var animation = require('./lib/animation');
var CronJob = require('cron').CronJob;
var ledutils = require('ledutils');
var alternate_rows = ledutils.alternate(16);
var flip_stick = ledutils.flip(128);

var board = new five.Board();
var strip = null;
var mainColor = '#000000';
var iconNextHour = 'rain';
var numberOfHours = 4;
var leds = new Array(8);
for(var i=0; i<leds.length; i++) {
  leds[i] = new Array(16).fill('#000000');
}

function handleForecast (err, w) {
  if (err) return console.dir(err);
  var avgTemperature = temperature.average(w.hourly, numberOfHours);
  mainColor = temperature.mapToColor(avgTemperature);
  // iconNextHour = weather.icon(w);
}

leds.forEach2D = function (func) {
  var self = this;
  this.forEach(function (column, rowIdx) {
    column.forEach(function (led, columnIdx) {
      func(self, led, rowIdx, columnIdx);
    });
  });
};

var animationMap = {
  rain: function () { animation.rain(leds, mainColor); },
  _default: function () { animation.default(leds, mainColor); }
};

function dumpLedsToStrip (strip) {
  leds.forEach2D(function (arr, led, rowIdx, columnIdx) {
    var idx = alternate_rows(flip_stick(rowIdx * 16 + columnIdx));
    strip.pixel(idx).color(led);
  });
}

board.on('ready', function () {
  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [{ pin: 6, length: 128 }]
  });

  strip.on('ready', function () {
    // Setup Animation Loop
    setInterval(function () {
      if (animationMap[iconNextHour]) {
        animationMap[iconNextHour]();
      } else {
        animationMap._default();
      }
      dumpLedsToStrip(strip);
      strip.show();
    }, 100); // 10 Hz

    // Setup Forecast Updating
    var cronjob = new CronJob({
      cronTime: '*/15 * * * *',
      onTick: function () {
        forecast.fetch(handleForecast);
      },
      start: true,
      runOnInit: true
    });
  });
});
