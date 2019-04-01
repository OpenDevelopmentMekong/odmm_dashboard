function generateSubindexButtons(id) {
  var barChartId = '.unit4BarChart';
  var subIndices = Object.keys(keyTranslationsEN);
  d3.select(id).selectAll('button').remove();

  d3.select(id)
    .selectAll('button')
    .data(subIndices)
    .enter()
    .append('button')
    .attr("onclick", function (d) {
      return `var barData = buildBarData(unit4Township, '${d}');
      drawSubindexBar('${barChartId}', barData, unit4Township, '${d}');`
    })
    .text(function(d) { return keyTranslationsEN[d];})
    .style('display', 'block')
    .style('margin', '5px 0 0 0')
    .style('width', '80%');
}

function drawSubindexBar(id, data, township, subindex) {
  var options = {};
  barChart(data, id, options);
}

function buildBarData(township, subindex) {
  var data, nameAccessor, barData = [];
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
  }

  for (var i in data) {
    var barDataRow = {};
    barDataRow.label = data[i][nameAccessor];
    barDataRow.value = data[i][subindex];
    barData.push(barDataRow);
  }

  return barData;
}
