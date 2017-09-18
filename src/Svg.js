const d3 = require('d3');

class Svg {
  constructor(className = '') {
    this.svg = d3.select(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    ).classed(className, true);
  }

  setWidth(width) {
    this.svg.attr('width', width);
    return this;
  }

  setHeight(height) {
    this.svg.attr('height', height);
    return this;
  }

  setColorScale(domain = [0, 1]) {
    this.colorScale = d3.scaleSequential(d3.interpolatePlasma).domain(domain);
    return this;
  }

  setLinearScale(domain = [0, 1], range = [0, 1]) {
    this.linearScale = d3.scaleLinear().domain(domain).range(range);
    return this;
  }

  unsetLinearScale() {
    this.linearScale = null;
    return this;
  }

  appendHeatMap({
    data = [0, 1],
    width = 5,
    height = 5,
    y = 0,
    shift = { x: 0, y: 0 },
    className
  }) {
    this.svg.append('g')
      .selectAll().data(data)
      .enter().append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', (_, i) => (this.linearScale ? this.linearScale(i) : i * width) + shift.x)
      .attr('y', y + shift.y)
      .style('fill', d => this.colorScale(d))
      .classed(className, !!className);
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
      .text(d => String(d))
      .attr('x', (_, i) => i * offset.x + shift.x)
      .attr('y', (_, i) => i * offset.y + shift.y)
      .attr('font-size', fontSize)
      .classed(className, true);
    return this;
  }

  appendToNode(node) {
    node.appendChild(this.svg.node());
    return this;
  }

  appendAxisX(xAxis, offset = { x: 0, y: 0 }) {
    this.svg
      .append('g')
      .attr('transform', `translate(${offset.x}, ${offset.y})`)
      .call(xAxis);
    return this;
  }
}

export default Svg;
