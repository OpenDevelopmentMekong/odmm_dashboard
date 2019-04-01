/* Allows toggling between state/region and Townships
based on the given dataset */
function setAreaLevel(targetDataset, unitSelector, township) {
  // Empty out the old dropdown options
  var nameVar = "";
  if (township == true) { nameVar = 'township_name:taf'; }
  else { nameVar = 'state_name:taf'; }
  d3.select(unitSelector)
    .select("#areaSelector")
    .selectAll("select")
    .selectAll("option")
    .data([])
    .exit()
    .remove();

  // Populate the dropdown options with new data
  d3.select(unitSelector)
    .select("#areaSelector")
    .selectAll("select")
    .selectAll("option")
    .data(targetDataset)
    .enter()
    .append("option")
    .attr("value", function(d) { return d[nameVar]; } )
    .text(function(d) { return d[nameVar]; });
}

/* Call this func whenever the data changes to update RadarChart */
function changeRadar(selector, otherSelector, township) {
  var nameVar = "";
  var data = {};
  if (township == true) {
    nameVar = 'township_name:taf';
    data = tspData;
  } else {
    nameVar = 'state_name:taf';
    data = srData;
  }
  // Subset original data based on selection
  var newArea = d3.select(selector).property("value");
  var otherArea = d3.select(otherSelector).property("value");
  var newData = subsetSummaryByArea([newArea, otherArea], data, nameVar);

  // Reshape subset to fit to radarChart.js input
  var radarData = reshapeForRadar(newData);

  // Prepare chart
  var radarChartOptions = {
    w: 400,
    h: 400,
    maxValue: 10,
    levels: 3,
    ExtraWidthX: 250,
    TranslateX: 125,
    roundStrokes: false,
  };
  RadarChart.draw(".radarChart", radarData, radarChartOptions);

}

/* Note that each row in the dataset represents a single area.
@Given a list of areas and the original dataset,
@Returns only the rows specified by the list of areas */
function subsetSummaryByArea(areaList, data, nameVar) {
  var returnData = [];
  for (var i in areaList) {
    for (var j in data) {
      if (areaList[i] == data[j][nameVar]) {
        returnData.push(data[j]);
      }
    }
  }
  return returnData;
}

/* @Given a list of rows,
@Returns a list of list of dicts as required by RadarChart.js*/
function reshapeForRadar(origData) {

  var radarData = [];
  if (origData.length == undefined) {
    origData = [origData];
  }
  var keys = Object.keys(origData[0]);

  // We don't need to use all data fields for radarChart,
  // so we remove some columns
  keys.splice(0,subDataSpliceIndex);

  for (i in origData) {
    radarData.push([]);
    // TODO: Get rid of non axes
    for (j in keys) {
      var value = +origData[i][keys[j]];
      radarData[i].push({"axis": keyTranslationsEN[keys[j]],
        "value": value});
    }
  }
  return radarData;
}
