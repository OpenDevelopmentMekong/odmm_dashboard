// Global fills
var selectedArea;
var selectedFill = '#05713a', normalFill = '#b6af9d', activeFill = 'rgb(5, 113, 58, 0.6)',
    boundaryFill = '#eeeeee';

function changeSelected(id) {

  if (selectedArea != undefined) {
    d3.select(selectedArea)
      .attr('fill', normalFill);
  }
  d3.select(id)
    .attr('fill', selectedFill);
  selectedArea = id;
}
function hideMap() {
  d3.select('.mapSelector').selectAll('svg').remove();
}
function drawMap(township) {
  var mapWidth = 220, mapHeight = 500;
  d3.select('.mapSelector').selectAll('svg').remove();
  var mapSvg = d3.select('.mapSelector')
    .append('svg')
    .attr('width', mapWidth)
    .attr('height', mapHeight);

  var areas = mapSvg.append('g');
  var mercProjection = d3.geo.mercator()
    .scale(1200)
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
    .remove();

  var scrollOffset = -45;
areas.selectAll('path')
    .data(mapStateRegion.features)
    .enter()
    .append('path')
    .attr('id', (d) => (d.properties[accessorForAreaName].replace(/ /g, "")))
    .attr('fill', normalFill)
    .attr('stroke', boundaryFill)
    .attr('onclick', function(d) {
      var tafName=pcodeToTAF(d.properties[accessorForPcode]);
      var onClickFunc =
        `drawSubNationChart("${tafName}", false, '.unit2RadarChart');
        d3.select('#subnationalDropdown').property('value', '${tafName}');
        drawSubnationBar("${tafName}", false, '.unit2BarChart');
        changeSelected('#${d3.select(this).attr('id')}');`;

      return onClickFunc;
    })
    .on('mouseover', function(d,i) {
      if (selectedArea != '#'+d3.select(this).attr('id')) {
        d3.select(this).attr('fill', activeFill);
      }
    })
    .on('mouseout', function(d,i) {
      if (selectedArea != '#'+d3.select(this).attr('id')) {
        d3.select(this).attr('fill', normalFill);
      }
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
  // Find medians across all areas in level
  var medianData = {};
  var keys = Object.keys(data[0]);
  keys.splice(0, subDataSpliceIndex);
  for (var i in keys) {
    var medianValue = d3.median(data, function (d) {
       return d[keys[i]];
    });
    medianData[keys[i]] = medianValue;
  }
  // Find area-specific data
  for (var j in data) {
    if (data[j][nameAccessor] == areaName) {
      var areaData = data[j];
    }
  }
  var areaRadarData = reshapeForRadar(areaData);
  for (var k in areaRadarData[0]) {
    var subindexNum = +k+1;
    areaRadarData[0][k].median = medianData['sub'+subindexNum];
  }
  var radarChartOptions = {
    maxValue: 10,
    levels: 5,
    roundStrokes: false,
    median: true,
    spider: false
  };
  RadarChart.draw(id, areaRadarData, radarChartOptions);
}
function populateSubnationalDropdown(township, id) {
  d3.select(id)
    .selectAll('option')
    .data([])
    .exit()
    .remove();

  var data, nameAccessor, textAccessor;
  if (township == true) {
    data = tspData;
    nameAccessor = 'township_name:taf';
    textAccessor = nameAccessor;
    if (lang == 'MM') { textAccessor = 'township_name:mm'; }
  } else {
    data = srData;
    nameAccessor = 'state_name:taf';
    textAccessor = nameAccessor;
    if (lang == 'MM') { textAccessor = 'state_name:mm'; }
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
      return d[textAccessor];
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
    barRow.label = keyTranslations[lang][keys[j]];
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
