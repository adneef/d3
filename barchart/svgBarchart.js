const svg = d3.select("svg"),
margin = {top: 20, right: 20, bottom: 30, left: 60},
width = +svg.attr("width") - margin.right - margin.left,
height = +svg.attr("height") - margin.top - margin.bottom

const x = d3.scaleBand()
.rangeRound([0, width])
.padding(0.1)

const y = d3.scaleLinear()
.rangeRound([height, 0])

const g = svg
.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`)

d3.csv("./data.csv", d => {
  return {
    letter: d.letter,
    frequency: +d.frequency
  }
})
  .then(data => {

  x.domain(data.map( d => d.letter))
  y.domain([0, d3.max(data, d => d.frequency)])

  g
  .append("g")
  .attr("class", "axis axis--x")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))

  g
  .append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Frequency")

  g
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.letter))
  .attr("y", d => y(d.frequency))
  .attr("width", x.bandwidth())
  .attr("height", d => height - y(d.frequency))
})
