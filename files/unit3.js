/* Allows toggling between state/region and Townships
based on the given dataset */
function setAreaLevel(targetDataset, unitSelector) {
  unitSelector = '#' + unitSelector;
  // Empty out the old dropdown options
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
    .attr("value", function(d) { return d.name; } )
    .text(function(d) { return d.name; });

    // This is just a courtesy return to avoid a two-line call to function
    // e.g. data = setAreaLevel(newDataset, 'unit3'); instead of
    //      setAreaLevel(newDataset, 'unit3');
    //      data = newDataset,
    //          where data is a global accessed by callback functions
    //          indicating the currently selected dataset
    return targetDataset;
}

/* Call this func whenever the data changes to update RadarChart */
function changeRadar(selectorId, otherSelectorId, data) {
  // Subset original data based on selection
  var newArea = d3.select('#'+selectorId).property("value");
  var otherArea = d3.select('#'+otherSelectorId).property("value");
  var newData = subsetSummaryByArea([newArea, otherArea], data);

  // Reshape subset to fit to radarChart.js input
  var radarData = reshapeForRadar(newData);

  // Prepare chart
  var radarChartOptions = {
    w: 500,
    h: 500,
    maxValue: 10,
    levels: 5,
    roundStrokes: false,
  };
  RadarChart(".radarChart", radarData, radarChartOptions);

}

/* Note that each row in the dataset represents a single area.
@Given a list of areas and the original dataset,
@Returns only the rows specified by the list of areas */
function subsetSummaryByArea(areaList, data) {
  var returnData = [];
  for (i in areaList) {
    for (j in data) {
      if (areaList[i] == data[j]['name']) {
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
  var keys = Object.keys(origData[0]);

  // We don't need to use all data fields for radarChart,
  // so we remove some columns
  keys.splice(0,3);
  keys.splice(-1,1);

  for (i in origData) {
    radarData.push([]);
    // TODO: Get rid of non axes
    for (j in keys) {
      var value = +origData[i][keys[j]];
      radarData[i].push({"axis": keys[j],
        "value": value});
    }
  }
  return radarData;
}
