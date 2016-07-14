function averageTemperature (weather, numberOfHours) {
  // Calculate the average temperature for the next numberOfHours
  return (weather.data.slice(0, numberOfHours)
      .map(function (v) { return v.temperature; })
      .reduce(function (l, r) { return l + r; })) / numberOfHours;
}

function mapTemperatureToColor (temperature) {
  // Quick and Simple set of colors
  // You can do better than this, but this is easy to understand
  // For now.
  if (temperature < 60) {
    return '#000077';
  }

  if (temperature < 70) {
    return '#004499';
  }

  if (temperature < 80) {
    return '#777700';
  }

  return '#770000';
}

module.exports = {
  average: averageTemperature,
  mapToColor: mapTemperatureToColor
};
