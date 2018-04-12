
// create initial svg
const svg = d3
.select('body')
.append('svg')
.attr('width', 960)
.attr('height', 500)

// set svg attributes
const margin = {top: 20, right: 20, bottom: 50, left: 150},
width = svg.attr('width') - margin.right - margin.left,
height = svg.attr('height') - margin.top - margin.bottom

// create defs for our svg styling gradients
const defs = svg
.append('defs')


// create a linearGradient for the chart's bars
const sunbeam = defs
.append('linearGradient')
.attr('id', 'sunbeam')

sunbeam
.append('stop')
.attr('offset', '25%')
.attr('stop-color', 'white')

sunbeam
.append('stop')
.attr('id', 'beamEnd')
.attr('offset', '95%')
.attr('stop-color', 'rgb(255, 230, 0)')

// create radialGradients for the inner and outer sun components
const corona = defs
.append('radialGradient')
.attr('id', 'corona')

corona
.append('stop')
.attr('offset', '66%')
.attr('stop-color', 'rgb(255, 230, 0)')

corona
.append('stop')
.attr('offset', '95%')
.attr('stop-color', 'white')

const core = defs
.append('radialGradient')
.attr('id', 'core')

core
.append('stop')
.attr('offset', '25%')
.attr('stop-color', 'orange')

core
.append('stop')
.attr('offset', '75%')
.attr('stop-color', 'rgb(255, 230, 0)')

// create a variable for a baseline g element that we can add many of
const g = svg
.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`)

// create a months array, corresponding to the data we expect to receive
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec', 'Annual']

// create the function that will make our barchart (es6)
const solarViz = async () => {

  const x = d3.scaleLinear()
  .range([0, width])

  const y = d3.scaleBand()
  .rangeRound([height, 0])
  .padding(0.1)

  // get our data
  const result = await d3.json('./PVWattsData.json')

  // pull out of the data the stuff we want
  let solRadMonthlyArr = result.outputs.solrad_monthly
  solRadMonthlyArr.push(result.outputs.solrad_annual)

  // instantiate an empty array and reformat our data into an array of nested objects
  // that will be easier to access in our chart
  const data = []

  for(let i = 0; i < months.length; i++) {
    data.unshift({month: months[i], solRad: solRadMonthlyArr[i]})
  }

  // set the x and y domains based on our returned data
  x.domain([d3.min(data, d => d.solRad) - 0.2, d3.max(data, d => d.solRad) + 0.2])
  y.domain(data.map(d => d.month))

  // label the x-axis
  g
  .append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(x))

  // title the x-axis
  g
  .append('text')
  .attr('class', 'label')
  .attr('dy', '0.71em')
  .attr('y', height + 20)
  .attr('x', width/2)
  .attr('text-anchor', 'end')
  .text('kWh/m2/day')

  // label the y-axis
  g
  .append('g')
  .attr('class', 'axis axis--y')
  .call(d3.axisLeft(y))

  // title the y-axis
  g
  .append('text')
  .attr('class', 'label')
  .attr('transform', 'rotate(-90)')
  .attr('y', -Number(margin.left)/5)
  .attr('x', -height/2)
  .attr('text-anchor', 'middle')
  .text('Month')

  // create the bars for our chart dynamically based on how much data there is
  const bar = g
  .selectAll('.bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', 2)
  .attr('y', d => y(d.month))
  .attr('width', d => x(d.solRad))
  .attr('height', y.bandwidth())

  // label the bars with their values for better precision
  g
  .selectAll('.barLabel')
  .data(data)
  .enter()
  .append('text')
  .attr('class', 'barLabel')
  .attr('x', d => x(d.solRad))
  .attr('y', d => y(d.month))
  .attr('dy', '1.2em')
  .attr('dx', '-2.5em')
  .text(d => Number(d.solRad).toFixed(3))

  console.log(bar.attr('height'))

  // add a sun to the left side of our svg, inner and outer components
  const corona = svg
  .append('ellipse')
  .data(data)
  .attr('class', 'corona')
  .attr('cx', 0)
  .attr('cy', y('Aug'))
  .attr('ry', d => y(d.month)/2)
  .attr('rx', Number(margin.left) * 0.7)

  const core = svg
  .append('ellipse')
  .data(data)
  .attr('class', 'core')
  .attr('cx', 0)
  .attr('cy', y('Aug'))
  .attr('ry', +corona.attr('ry')/3)
  .attr('rx', +corona.attr('rx')/3)

}

// call the function to create our chart
solarViz()
