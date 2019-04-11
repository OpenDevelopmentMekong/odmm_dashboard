function drawNationChart(township, id) {
  var medianData = generateMedians(township);
  var radarChartOptions = {
    maxValue: 10,
    levels: 5,
    roundStrokes: false,
    median: false,
    tiers: true
  }
  RadarChart.draw(id, medianData, radarChartOptions);

}
function drawLegend() {
  var legend = d3.select(".unit1BarChart")
    .append("svg")
    .attr("width", "100px")
    .attr("height", "250px")
    .append("g");

  var legendData = [
    { name: "High", mmname: "အမြင့်", color: "#89cfc9" },
    { name: "Middle", mmname: "အလယ်", color: "#67b1b3" },
    { name: "Low", mmname: "နိမ့်", color: "#297588" },
    { name: "Bottom", mmname: "အောက်ဆုံး", color: "#045971" }
  ]

  legend.selectAll(".legendRect")
    .data(legendData)
    .enter()
    .append("svg:rect")
    .attr("class", "legendRect")
    .attr("width", "20px")
    .attr("height", "20px")
    .attr("fill", (d)=>(d.color))
    .attr("y", (d,i)=>(i*30))
    .attr("x", 0)

  legend.selectAll(".legendText")
    .data(legendData)
    .enter()
    .append("svg:text")
    .attr("class", "legendText")
    .attr("x", 30)
    .attr("font-size", "12px")
    .attr("y", (d,i)=>(i*30))
    .text(function(d) {
      if (lang == 'EN') { return d.name; }
      else if (lang == 'MM') { return d.mmname; }
    })
    .attr("transform", "translate(0,15)");

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
    medianData[0].push({'axis': starburstLegend[lang][keys[i]], 'value': medianValue});
  }
  return medianData;
}

function reshapeForUnit1BarChart(data) {
  var retData = [];
  var nameAccessor;
  if (lang == 'EN') { nameAccessor = 'state_name:taf'; }
  else if (lang == 'MM') { nameAccessor = 'state_name:mm'; }
  var valueAccessor = 'score';
  var tierAccessor = 'tier';

  for (var i in data) {
    var row = {};
    row.label = data[i][nameAccessor];
    row.value = data[i][valueAccessor];
    row.tier = data[i][tierAccessor];
    retData.push(row);
  }

  return retData;
}

function renderText(lang) {
  d3.select('.unit2')
    .selectAll('button')
    .text( function(d,i) {
      if (i==0) { return copy.stateregion[lang]; }
      else { return copy.township[lang]; }
    });

  d3.select('.unit3').select('#areaLevelSelector')
    .selectAll('button')
    .text( function(d,i) {
      if (i==0) { return copy.stateregion[lang]; }
      else { return copy.township[lang]; }
    });

  d3.select('.unit4').select('.unit4Switch')
    .selectAll('button')
    .text( function(d,i) {
      if (i==0) { return copy.stateregion[lang]; }
      else { return copy.township[lang]; }
    });

  d3.select('.intro').select('p')
    .text(copy.about[lang]);

  d3.select('.unit1RadarChart').select('h3')
    .text(copy.medianStarburst[lang]);

  d3.select('.unit1BarChart').select('h3')
    .text(copy.nationalRankings[lang]);

  d3.select('.unit2').select('h3')
    .text(copy.unit2Header[lang]);

  d3.select('.unit3').select('h3')
    .text(copy.unit3Header[lang]);

  d3.select('.unit4').select('h3')
    .text(copy.unit4Header[lang]);

}
