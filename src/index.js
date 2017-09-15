import range from 'lodash/range';
import partial from 'lodash/partial';

import {
  heatMap as heatMapClass,
  legendText
} from './heatMap.scss';
import Svg from './Svg';

const min = 0;
const max = 9;
const step = 0.2;

const getStepsNum = partial(
  (min, max, step) => (max - min + 1) / step,
  min, max
);

const app = document.getElementById('app');

// const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
// fetch(url).then(response => response.json()).then(console.log);


const svg = new Svg(heatMapClass);

svg
  .setColorScale([0, 10])
  .appendHeatMap({
    data: range(min, max + 1, step),
    width: 8,
    height: 20
  })
  .appendTextGroup({
    data: range(min, max + 1, 1),
    offset: {
      x: 8 * getStepsNum(step) / getStepsNum(1),
      y: 20 + 14
    },
    className: legendText
  });

app.appendChild(svg.getSvgNode());
