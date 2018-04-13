// create initial svg
const svg = d3
.select('svg')

// set svg attributes
const margin = {top: 20, right: 20, bottom: 50, left: 150},
x = d3.scaleLinear(),
y = d3.scaleBand().padding(0.1)

// create global variables to store our data and location
let theData
let where

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
.attr('offset', '99%')
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

// instantiate chart title, axes, axis titles, and the sun image on the left - values will be filled in later
svg.append('text').attr('class', 'chartTitle')

g.append('g').attr('class', 'axis axis--x')
g.append('g').attr('class', 'axis axis--y')

g.append('text').attr('class', 'label x-title')
g.append('text').attr('class', 'y-title label')

g.append('ellipse').attr('class', 'core')
g.append('ellipse').attr('class', 'corona')

// get our data and organize it
const getData = async () => {

  // actually grab our data
  const result = await d3.json('./PVWattsData.json')

  // grab city and state out of our data and process it to be the format we want
  let city = result.station_info.city,
  state = result.station_info.state

  city = city[0] + city.slice(1).toLowerCase()

  where = `${city}, ${state}`

  // grab the solrad_monthly array from result and push solrad_annual on the end
  let solRadMonthlyArr = result.outputs.solrad_monthly
  solRadMonthlyArr.push(result.outputs.solrad_annual)

  // instantiate an empty array and reformat our data into an array of nested objects
  // that will be easier to access in our chart
  const data = []

  for(let i = 0; i < months.length; i++) {
    data.unshift({month: months[i], solRad: solRadMonthlyArr[i]})
  }

  // set data to our global data variable
  theData = data

  // set the x and y domains based on our returned data
  x.domain([d3.min(data, d => d.solRad) - 0.2, d3.max(data, d => d.solRad) + 0.2])
  y.domain(data.map(d => d.month))

  makeChart()
}

// create the function that will make our barchart (es6)
const makeChart = () => {


  const bounds = svg.node().getBoundingClientRect(),
  width = bounds.width - margin.right - margin.left,
  height = bounds.height - margin.top - margin.bottom

  x.range([0, width])
  y.rangeRound([height, 0])

  // label the x-axis
  g
  .select('.axis--x')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(x))

  // label the y-axis
  g
  .select('.axis--y')
  .call(d3.axisLeft(y))

  // title the x-axis
  g
  .select('.x-title')
  .attr('y', height + margin.bottom/1.3)
  .attr('x', width/2)
  .attr('text-anchor', 'middle')
  .text('kWh/m2/day')

  // title the y-axis
  g
  .select('.y-title')
  .attr('transform', 'rotate(-90)')
  .attr('y', -Number(margin.left)/3.75)
  .attr('x', -height/2)
  .attr('text-anchor', 'middle')
  .text('Month')

  // create the bars for our chart dynamically based on how much data there is
  const bars = g
  .selectAll('.bar')
  .data(theData)

  bars.exit().remove()

  bars
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', 2)
  .attr('y', d => y(d.month))
  .attr('width', d => x(d.solRad))
  .attr('height', y.bandwidth())

  bars
  .attr('x', 2)
  .attr('y', d => y(d.month))
  .attr('width', d => x(d.solRad))
  .attr('height', y.bandwidth())

  // label the bars with their values for better precision
  const barLabels = g
  .selectAll('.barLabel')
  .data(theData)

  // remove extra bars on window resize
  barLabels.exit().remove()

  // add bar labels to display the value of each bar
  barLabels
  .enter()
  .append('text')
  .attr('class', 'barLabel')
  .attr('x', d => x(d.solRad))
  .attr('y', d => y(d.month))
  .attr('dy', '1.2em')
  .attr('dx', '-2.5em')
  .text(d => +d.solRad.toFixed(3))

  // update bar labels once they already exist but the window size changes
  barLabels
  .attr('x', d => x(d.solRad))
  .attr('y', d => y(d.month))
  .attr('dy', '1.2em')
  .attr('dx', '-2.5em')
  .text(d => +d.solRad.toFixed(3))

  // add a sun to the left side of our svg, inner 'core' and outer 'corona' components
  svg
  .select('.corona')
  .data(theData)
  .attr('cx', -margin.left)
  .attr('cy', y('Aug'))
  .attr('ry', d => y(d.month)/3)
  .attr('rx', +margin.left * 0.6)

  svg
  .select('.core')
  .data(theData)
  .attr('class', 'core')
  .attr('cx', 0)
  .attr('cy', y('Aug'))
  .attr('ry', +corona.attr('ry')/3)
  .attr('rx', +corona.attr('rx')/3)

  // append title to our svg based on size of chart
  svg
  .select('.chartTitle')
  .data(theData)
  .attr('x', d => x(d.solRad))
  .attr('y', margin.top)
  .attr('text-anchor', 'middle')
  .text(`Monthly and Annual Solar Radiation Values Near ${where}`)
}

// create and call the function to make our chart
const assemble = async () => {
  if(!theData) await getData()
  d3.select(window).on('resize', makeChart)
}

assemble()
