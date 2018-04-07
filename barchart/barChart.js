const data = [30, 86, 168, 281, 303, 365]

const x = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, 365])

d3.select(".chart")
  .selectAll("div")
  .data(data)
  .enter()
  .append("div")
  .style("width", function(d) {return x(d) + "px"})
  .text(function(d) { return d})
