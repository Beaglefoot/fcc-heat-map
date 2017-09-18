const d3 = require('d3');
d3.tip = require('d3-tip');

import { d3Tip, n } from './Tip.scss';

const tip = d3.tip().attr('class', `${d3Tip} ${n}`).offset([-9, 0]).html(d => d);

export default tip;
