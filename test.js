var pixel = require('node-pixel');
var five = require('johnny-five');
var ledutils = require('ledutils');
var alternate_rows = ledutils.alternate(16);

var board = new five.Board();
var strip = null;

board.on('ready', function () {
  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [ { pin: 6, length: 128 } ]
  });

  strip.on('ready', function () {
    strip.color('#000000');
    strip.show();
    var currentPosition = 0;

    setInterval(function () {
      var idx = alternate_rows(currentPosition);
      strip.pixel(idx).color('#000000');
      currentPosition = (currentPosition + 1) % 128;
      idx = alternate_rows(currentPosition);
      strip.pixel(idx).color('#440000');
      strip.show();
    }, 100);
  });
});