function drawMap(mapData, targetSvgGroup, pathFunc, state) {
  var accessorForAreaName = '';
  if (state) {
    accessorForAreaName = 'ST';
  } else {
    accessorForAreaName = 'TS';
  }
  targetSvgGroup.selectAll('path')
    .data([])
    .exit()
    .remove()

  targetSvgGroup.selectAll('path')
    .data(mapData)
    .enter()
    .append('path')
    .attr('id', (d) => (d.properties[accessorForAreaName]))
    .attr('fill', '#110000')
    .attr('stroke', '#aabbcc')
    .on('click', function(d,i) { mapClick(d, accessorForAreaName);})
    .on('mouseover', function(d,i) {
      d3.select(this).attr('fill', '#00ee00');
    })
    .on('mouseout', function(d,i) {
      d3.select(this).attr('fill', '#110000');
    })
    .attr('d', pathFunc);
}

function mapClick(datum, accessor) {
  d3.select('#unit2').select('h2').select('a')
    .text(datum.properties[accessor]);
}

function setupMap(mapWidth, mapHeight) {

}
