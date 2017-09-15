const d3 = require('d3');

import range from 'lodash/range';

import { chart } from './chart.scss';

const svg = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
  .attr('width', '100%')
  .attr('height', '500')
  .classed(chart, true);

const scale = d3.scaleSequential(d3.interpolatePlasma).domain([0, 10]);

svg.append('g')
  .selectAll().data(range(0, 10, 0.1))
  .enter().append('rect')
  .attr('width', 8)
  .attr('height', 20)
  .attr('x', (_, i) => i * 8)
  .attr('y', 50)
  .style('fill', d => scale(d));

export default svg.node();
