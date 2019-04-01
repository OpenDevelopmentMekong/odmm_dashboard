function drawNationChart(township, id) {
  var medianData = generateMedians(township);
  var radarChartOptions = {
    w: 300,
    h: 300,
    maxValue: 10,
    levels: 3,
    ExtraWidthX: 250,
    TranslateX: 125,
    roundStrokes: false,
  };
  RadarChart.draw(id, medianData, radarChartOptions);

}

function generateMedians(township) {
  var data;
  if (township == true) {
    console.log('township medians');
    data = tspData;
  } else {
    console.log('state medians');
    data = srData;
  }

  var medianData = [[]];
  var keys = Object.keys(data[0]);
  keys.splice(0, subDataSpliceIndex);

  for (var i in keys) {
    var medianValue = d3.median(data, function (d) {
       return d[keys[i]];
    });
    medianData[0].push({'axis': keyTranslationsEN[keys[i]], 'value': medianValue});
  }
  console.log(medianData[0]);
  return medianData;
}
