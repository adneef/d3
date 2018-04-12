const svg = d3
.select('body')
.append('svg')
.attr('width', 960)
.attr('height', 500)

const margin = {top: 20, right: 20, bottom: 50, left: 50},
width = svg.attr('width') - margin.right - margin.left,
height = svg.attr('height') - margin.top - margin.bottom

const g = svg
.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`)

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec', 'Annual']

const solarViz = async () => {

  const x = d3.scaleLinear()
  .range([0, width])

  const y = d3.scaleBand()
  .rangeRound([height, 0])
  .padding(0.1)

  const result = await d3.json('./PVWattsData.json')

  let solRadMonthlyArr = result.outputs.solrad_monthly
  solRadMonthlyArr.push(result.outputs.solrad_annual)
  const data = []

  for(let i = 0; i < months.length; i++) {
    data.unshift({month: months[i], solRad: solRadMonthlyArr[i]})
  }

  x.domain([d3.min(data, d => d.solRad) - 0.2, d3.max(data, d => d.solRad) + 0.2])
  y.domain(data.map(d => d.month))

  g
  .append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(x))

  g
  .append('text')
  .attr('class', 'label')
  .attr('dy', '0.71em')
  .attr('y', width/2 + 10)
  .attr('x', height)
  .attr('text-anchor', 'end')
  .text('kWh/m2/day')

  g
  .append('g')
  .attr('class', 'axis axis--y')
  .call(d3.axisLeft(y))

  g
  .append('text')
  .attr('class', 'label')
  .attr('transform', 'rotate(-90)')
  .attr('dy', '0.71em')
  .attr('y', -42)
  .attr('x', -height/2)
  .attr('text-anchor', 'end')
  .text('Month')

  const bar = g
  .selectAll('.bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', d => 2)
  .attr('y', d => y(d.month))
  .attr('width', d => x(d.solRad))
  .attr('height', y.bandwidth())

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

}

solarViz()
