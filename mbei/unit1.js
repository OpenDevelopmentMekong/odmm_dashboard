function drawNationChart(township, id) {
  var medianData = generateMedians(township);
  var radarChartOptions = {
    w: 300,
    h: 300,
    maxValue: 10,
    levels: 5,
    ExtraWidthX: 250,
    TranslateX: 125,
    roundStrokes: false,
    median: false
  }
  RadarChart.draw(id, medianData, radarChartOptions);

}

function generateMedians(township) {
  var data;
  if (township == true) {
    data = tspData;
  } else {
    data = srData;
  }

  var medianData = [[]];
  var keys = Object.keys(data[0]);
  keys.splice(0, subDataSpliceIndex);

  for (var i in keys) {
    var medianValue = d3.median(data, function (d) {
       return d[keys[i]];
    });
    medianData[0].push({'axis': starburstLegendEN[keys[i]], 'value': medianValue});
  }
  return medianData;
}

function reshapeForUnit1BarChart(data) {
  var retData = [];
  var nameAccessor = 'state_name:taf';
  var valueAccessor = 'score';

  for (var i in data) {
    var row = {};
    row.label = data[i][nameAccessor];
    row.value = data[i][valueAccessor];
    retData.push(row);
  }

  return retData;
}
