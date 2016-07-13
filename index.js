var pixel = require('node-pixel');
var five = require('johnny-five');

var board = new five.Board();
var strip = null;
var status = false;

board.on('ready', function () {
  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [ { pin: 6, length: 128 }]
  });

  strip.on('ready', function () {
    var iterator = setInterval(function () {
      if (status) {
        strip.color('#770000');
      } else {
        strip.color('#000000');
      }
      strip.show();
      status = !status;
    }, 500); // 1Hz 50/50 duty cycle
  });
});