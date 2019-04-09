function barChart(data, id, options) {
  /* Configuring bar chart. Use defaults where caller has not supplied options. */
  var cfg = {
    mTop: 10,
    mRight: 30,
    mBottom: 80,
    mLeft: 40,
    baseWidth: 500,
    baseHeight: 300,
    circleRadius: 6,
    tiers: false
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

  svg.append("g")
    .append("svg:rect")
    .attr("height", cfg.height)
    .attr("width", cfg.width)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "#e4e4e4");

  /* Build x axis */
  var yScale = d3.scale.linear()
    .domain([0, maxValue])
    .range([cfg.height, 0]);

  var xScale = d3.scaleBand()
    .range([0, cfg.width])
    .domain(data.map( function (d) {
      return d.label;
    }))
    .padding(1);

  svg.append('g')
    .attr('transform', `translate(0,${cfg.height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text") //not sure what this does
    .attr('transform', 'translate(-15,15)rotate(-90)')
    .style('text-anchor', 'end');

  /* Build y axis */


  svg.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .attr('font-size', '12px');

  /* Build lines */
  var barWidth = cfg.width / data.length;

  var yScalePositive = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, cfg.height]);
  svg.selectAll('myBar')
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", "0")
    .attr("y", function(d) {
      return yScale(d.value);
    })
    .attr("width", 0.8*barWidth)
    .attr("height", function(d) {
      return yScalePositive(d.value);
    })
    .attr("transform", function(d) {
      var xTranslate = xScale(d.label) - 0.8*barWidth/2;
      return `translate(${xTranslate}, 0)`;
    });
  /*svg.selectAll('myline')
    .data(data)
    .enter()
    .append('line')
    .attr('x1', function(d) {
      return xScale(d.label);
    })
    .attr('x2', function (d) {
      return xScale(d.label);
    })
    .attr('y1', function (d) {
      return yScale(0);
    })
    .attr('y2', function (d) {
      return yScale(d.value);
    })
    .attr('stroke', 'grey');*/

  /*svg.selectAll('mycircle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return xScale(d.label);
    })
    .attr('cy', function (d) {
      return yScale(d.value);
    })
    .attr('r', `${cfg.circleRadius}`)
    .style('fill', '#69b3a2')
    .attr('stroke', 'black');*/

}
