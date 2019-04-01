function drawMap() {
  var mapWidth = 200, mapHeight = 500;
  var mapSvg = d3.select('.mapSelector')
    .append('svg')
    .attr('width', mapWidth)
    .attr('height', mapHeight);

  var areas = mapSvg.append('g');
  var mercProjection = d3.geo.mercator()
    .scale(1100)
    .center([96.0785, 19.7633])
    .translate([mapWidth/2, mapHeight/2]);
  var geoPath = d3.geo.path().projection(mercProjection);

  // Draw the map
  //drawMap(mapStateRegion.features, areas, geoPath, 1);
  var accessorForAreaName = 'ST';
  var accessorForPcode = 'ST_PCODE';
  areas.selectAll('path')
    .data([])
    .exit()
    .remove

areas.selectAll('path')
    .data(mapStateRegion.features)
    .enter()
    .append('path')
    .attr('id', (d) => (d.properties[accessorForAreaName]))
    .attr('fill', '#110000')
    .attr('stroke', '#aabbcc')
    .attr('onclick', function(d) {
      var tafName=pcodeToTAF(d.properties[accessorForPcode]);
      var onClickFunc =
        `drawSubNationChart("${tafName}", false, '.unit2RadarChart');
        d3.select('#subnationalDropdown').property('value', '${tafName}');
        drawSubnationBar("${tafName}", false, '.unit2BarChart');`;
      return onClickFunc;
    })
    .on('mouseover', function(d,i) {
      d3.select(this).attr('fill', '#00ee00');
    })
    .on('mouseout', function(d,i) {
      d3.select(this).attr('fill', '#110000');
    })
    .attr('d', geoPath);
}

function drawSubNationChart(areaName, township, id) {
  var data, nameAccessor;
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
  }

  for (var i in data) {
    if (data[i][nameAccessor] == areaName) {
      var areaData = data[i];
    }
  }

  var areaRadarData = reshapeForRadar(areaData);
  var radarChartOptions = {
    w: 300,
    h: 300,
    maxValue: 10,
    levels: 5,
    ExtraWidthX: 250,
    TranslateX: 125,
    roundStrokes: false,
  };
  RadarChart.draw(id, areaRadarData, radarChartOptions);
}
function populateSubnationalDropdown(township, id) {
  d3.select(id)
    .selectAll('option')
    .data([])
    .exit()
    .remove();

  var data, nameAccessor;
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
  }

  d3.select(id)
    .selectAll('option')
    .data(data)
    .enter()
    .append('option')
    .attr('value', function (d) {
      return d[nameAccessor];
    })
    .text(function (d) {
      return d[nameAccessor];
    })
}


function areaNameFromDropdown(id) {
  return d3.select(id).property("value");
}

function pcodeToTAF(pcode, township) {
  var data, nameAccessor, pcodeAccessor;
  if (township == true) {
    data = tspData;
    pcodeAccessor = 'township_pcode';
    nameAccessor = 'township_name:taf';
  } else {
    data = srData;
    pcodeAccessor = 'state_pcode';
    nameAccessor = 'state_name:taf';
  }

  for (var i in data) {
    if (data[i][pcodeAccessor] == pcode) {
      return data[i][nameAccessor];
    }
  }
}

function drawSubnationBar(areaName, township, id) {
  var data, nameAccessor;
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
  }

  // Reshape data
  var row;
  for (var i in data) {
    if (data[i][nameAccessor] == areaName) {
      row = data[i];
    }
  }

  var keys = Object.keys(row);
  keys.splice(0, subDataSpliceIndex);

  var barData = [];
  for (var j in keys) {
    var barRow = {};
    barRow.label = keyTranslationsEN[keys[j]];
    barRow.value = +row[keys[j]];
    barData.push(barRow);
  }

  barChart(barData, id, {});
}

function reshapeForUnit2BarChart(data, township) {
  var retData = [], nameAccessor;

  if (township == true) {
    nameAccessor = 'township_name:taf';
  } else {
    nameAccessor = 'state_name:taf';
  }

  for (var i in data) {
    var row = {};
    row.label = data[i][nameAccessor];
    row.value = data[i][valueAccessor];
    retData.push(row);
  }

  return retData;
}
