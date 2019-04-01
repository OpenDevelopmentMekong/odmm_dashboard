/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@           Initializing         @@@@ */
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
var srData = d3.csv.parse(mbei_stateregion);
var tspData = d3.csv.parse(mbei_township);
// Unit 3
//setAreaLevel(srData, '.unit3');
changeRadar('#select1', '#select2', false);

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@ General purpose functions here @@@@ */
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

// NOTE: Function will break if township or stateregion values are not unique
function lookup(toFind, searchVar, returnVar, township) {
  var returnList = [];
  var data = {};
  if (township == true) {
    data = tspData;
  } else {
    data = srData;
  }
  for (var i in toFind) { returnList.push(0); }
  // Loop through the data table
  for (i in data) {
    var item = data[i][searchVar];
    // See if each line contains the items we want to find
    for (var j in toFind) {
      if (item == toFind[j]) {
       // When found, return a list of translated items
       returnList[j] = data[i][returnVar];
      }
    }
  }
  return returnList;
}
