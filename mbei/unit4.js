function generateSubindexButtons(id) {
  var barChartId = '.unit4BarChart';
  var subIndices = ['Overall Score'];
  var keys = Object.keys(keyTranslationsEN);
  for (var i in keys) {
    subIndices.push(keys[i]);
  }
  d3.select(id).selectAll('select').remove();

  d3.select(id)
    .append('select')
    .attr('id', 'subindexSelector')
    .attr("onchange", function (d) {
      return `var barData = buildBarData(unit4Township, findCurrSubindex());
      drawSubindexBar('${barChartId}', barData);
      changeSubindexTitle(findCurrSubindex());`;
    })
    .selectAll('option')
    .data(subIndices)
    .enter()
    .append('option')
    .text(function(d) {
      if (d == 'Overall Score') {
        return d;
      } else {
      return keyTranslationsEN[d];
      }
    })
    .attr("value", (d)=>(d));
}
function findCurrSubindex() {
  return d3.select('#subindexSelector').property('value');
}
function changeSubindexTitle(subindex) {
  if (subindex == "Overall Score") {
    d3.select('.subindexName').text("Overall Score");
  } else {
    d3.select('.subindexName').text(keyTranslationsEN[subindex]);
  }
}

function drawSubindexBar(id, data) {
  var options = { hover: true,
    tiers: false };
  barChart(data, id, options);
}

function buildBarData(township, subindex) {
  if (subindex == "Overall Score") {
    subindex = 'score';
  }
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
