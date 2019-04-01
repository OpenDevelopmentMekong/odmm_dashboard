function barChart(data, id, options) {
  /* Configuring bar chart. Use defaults where caller has not supplied options. */
  var cfg = {
    mTop: 10,
    mRight: 30,
    mBottom: 40,
    mLeft: 150,
    baseWidth: 460,
    baseHeight: 500,
    circleRadius: 6
  };

  if('undefined' !== typeof options){
    for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
    }
  } // Note: From this point on, use config opendevelopmentmyanmar

  d3.select(id).select("svg").remove();

  cfg['width'] = cfg.baseWidth - cfg.mLeft - cfg.mRight;
  cfg['height'] = cfg.baseHeight - cfg.mTop - cfg.mBottom;

  /* Data manipulations and calculations */
  var maxValue = d3.max(data, function(d) {
    return d.value;
  });
  data.sort(function(a, b) {
    return b.value - a.value;
  });
  /* Build SVG */
  var svg = d3.select(id)
    .append("svg")
      .attr("width", cfg.width + cfg.mLeft + cfg.mRight)
      .attr("height", cfg.height + cfg.mTop + cfg.mBottom)
    .append("g")
      .attr("transform",
            `translate(${cfg.mLeft},${cfg.mTop})`);

  /* Build x axis */
  var xScale = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, cfg.width]);

  svg.append('g')
    .attr('transform', `translate(0,${cfg.height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text") //not sure what this does
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end');

  /* Build y axis */
  var yScale = d3.scaleBand()
    .range([0, cfg.height])
    .domain(data.map( function (d) {
      return d.label;
    }))
    .padding(1);

  svg.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .attr('font-size', '12px');

  /* Build lines */
  svg.selectAll('myline')
    .data(data)
    .enter()
    .append('line')
    .attr('x1', xScale(0))
    .attr('x2', function (d) {
      return xScale(d.value);
    })
    .attr('y1', function (d) {
      return yScale(d.label);
    })
    .attr('y2', function (d) {
      return yScale(d.label);
    })
    .attr('stroke', 'grey');

  svg.selectAll('mycircle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return xScale(d.value);
    })
    .attr('cy', function (d) {
      return yScale(d.label);
    })
    .attr('r', `${cfg.circleRadius}`)
    .style('fill', '#69b3a2')
    .attr('stroke', 'black');

}
