const svg = d3.select('svg'),
width = +svg.attr('width'),
height = +svg.attr('height')

const forceChart = async () => {
  const data = await d3.json('./data.json')

  const simulation = d3.forceSimulation()
    .nodes(data)

  simulation
    .force('charge_force', d3.forceManyBody())
    .force('center_force', d3.forceCenter(width / 2, height / 2))
    .force('collide_force', d3.forceCollide(30))

  const node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', 20)
    .attr('fill', circleColour)
    .text(d => d.name)

  const links_data = await d3.json('./dataLink.json')

  const link_force = d3.forceLink(links_data)
    .id(d => d.name)

  simulation.force('links', link_force)

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links_data)
    .enter()
    .append('line')
    .attr('stroke-width', 2)
    .style('stroke', linkColour)

  simulation.on('tick', tickActions)

  function tickActions() {
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
  }

  function circleColour(d) {
    if(d.sex === 'M') return 'DarkOrange'
    return 'DeepSkyBlue'
  }

  function linkColour(d) {
    if(d.type === 'A') return 'Yellow'
    return 'Red'
  }
}

forceChart()
