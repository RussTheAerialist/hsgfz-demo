var breath = require('./breath');
var onecolor = require('onecolor');

var currentPosition = 0;

function defaultAnimation (leds, mainColor) {
  var currentColor = breath.single(mainColor).hex();
  leds.forEach2D(function (arr, led, rowIdx, columnIdx) {
    arr[ rowIdx ][ columnIdx ] = currentColor;
  });
}

function rainAnimation (leds, mainColor) {
  var currentColor = breath.single(mainColor);
  leds.forEach(function (row, rowIdx) {
    if (Math.random() < 0.05) {
      leds[rowIdx][0] = currentColor.hex();
    } else {
      leds[rowIdx][0] = '#000000';
    }
  });
  leds.forEach2D(function (arr, led, rowIdx, columnIdx) {
    if (columnIdx === 0) {
      return;  // Skip the first row
    }

    // average current led with the three above it
    var thisColor = onecolor(arr[rowIdx][columnIdx]);
    var prevColor = onecolor(arr[rowIdx][columnIdx-1]);
    var r = Math.round(Math.sqrt(Math.pow((thisColor.red() * 255.0 + prevColor.red() * 255.0) / 2.1, 2)));
    var g = Math.round(Math.sqrt(Math.pow((thisColor.green() * 255.0 + prevColor.green() * 255.0) / 2.1, 2)));
    var b = Math.round(Math.sqrt(Math.pow((thisColor.blue() * 255.0 + prevColor.blue() * 255.0) / 2.1, 2)));
    arr[rowIdx][columnIdx] = thisColor.red(r / 255.0).green(g / 255.0).blue(b / 255.0).hex();
  });
}

function positionTest(leds, mainColor) {
  leds.forEach2D(function (arr, led, rowIdx, columnIdx) {
    if (rowIdx * 16 + columnIdx === currentPosition) {
      arr[ rowIdx ][ columnIdx ] = '#440044';
    } else {
      arr[ rowIdx ][ columnIdx ] = '#000000';
    }
  });
  currentPosition = (currentPosition + 1)%128;
}

module.exports = {
  default: defaultAnimation,
  rain: rainAnimation
};
