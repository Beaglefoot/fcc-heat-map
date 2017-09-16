const d3 = require('d3');

class Svg {
  constructor(className = '') {
    this.svg = d3.select(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    ).classed(className, true);
  }

  setColorScale(domain = [0, 1]) {
    this.colorScale = d3.scaleSequential(d3.interpolatePlasma).domain(domain);
    return this;
  }

  setLinearScale(domain = [0, 1], range = [0, 1]) {
    this.linearScale = d3.scaleLinear().domain(domain).range(range);
    return this;
  }

  appendHeatMap({
    data = [0, 1],
    width = 5,
    height = 5,
    y = 0
  }) {
    this.svg.append('g')
      .selectAll().data(data)
      .enter().append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', (_, i) => this.linearScale ? this.linearScale(i) : i * width)
      .attr('y', y)
      .style('fill', d => this.colorScale(d));
    return this;
  }

  appendTextGroup({
    data = [0, 1],
    offset = { x: 0, y: 0 },
    shift = { x: 0, y: 0 },
    className = '',
    fontSize = 14
  }) {
    this.svg.append('g')
      .selectAll().data(data)
      .enter().append('text')
      .text(d => JSON.stringify(d))
      .attr('x', (_, i) => i * offset.x + shift.x)
      .attr('y', offset.y + shift.y)
      .attr('font-size', fontSize)
      .classed(className, true);
    return this;
  }

  appendToNode(node) {
    node.appendChild(this.svg.node());
    return this;
  }
}

export default Svg;
