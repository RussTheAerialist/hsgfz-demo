var color = require('onecolor');

function clamp (value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function breathCalculation (value, cycle, breathIntensity) {
  value = value * 255.0;
  return clamp(Math.round(value + breathIntensity * ((Math.exp(Math.sin(cycle)) - 0.36787944) / 2.35040238729) - breathIntensity / 2.0), 0, 255);
}

function getCurrentCycleTime () {
  var d = new Date();
  return d.getTime() / 3000.0 * Math.PI;
}

function breathSingle (value, cycleTime, breathIntensity) {
  breathIntensity = breathIntensity || 100.0;
  cycleTime = cycleTime || getCurrentCycleTime();

  value = color(value);

  var r = breathCalculation(value.red(), cycleTime, breathIntensity);
  var g = breathCalculation(value.green(), cycleTime, breathIntensity);
  var b = breathCalculation(value.blue(), cycleTime, breathIntensity);
  // console.log(value.red(), value.green(), value.blue(), r,g,b);
  // return color('#000000');
  return value.red(r / 255.0).green(g / 255.0).blue(b / 255.0);
}

function breathArray (arr, cycleTime, breathIntensity, waveOffset) {
  breathIntensity = breathIntensity || 25;
  waveOffset = waveOffset || 0;
  cycleTime = cycleTime || (new Date.getTime() / 3000.0 * Math.PI);
  return arr.map(function (v, idx) {
    return breathSingle(v, (cycleTime - (idx * waveOffset)), breathIntensity);
  });
}

module.exports = {
  single: breathSingle,
  all: breathArray
};

