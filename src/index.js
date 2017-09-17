/* eslint no-unused-vars: off */
import partial from 'lodash/partial';

import {
  heatMap as heatMapClass,
  legendText,
  axesText
} from './heatMap.scss';

import Svg from './Svg';
import Loading from './Loading';

const d3 = require('d3');

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const svgWidth = 1500;
const svgHeight = 700;
const svgPadding = 20;
const heatMapWidth = svgWidth * 0.9;
const heatMapRowHeight = 40;
const legendBlockWidth = 50;
const legendBlockHeight = 20;
const legendFontSize = 14;
const axesFontSize = 18;
const monthsAsText = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthsFontSize = 16;
const maxLengthMonth = d3.max(monthsAsText, d => d.length);

const app = document.getElementById('app');

const loading = new Loading();

loading.appendToNode(app);
loading.startAnimation();

const svg = new Svg(heatMapClass);
svg.setWidth(svgWidth).setHeight(svgHeight);



const buildHeatMap = data => {
  const { baseTemperature, monthlyVariance } = data;

  const varianceByMonth = monthlyVariance.reduce(
    (varByMonth, { month, year, variance }) => {
      if (!varByMonth[month - 1]) varByMonth[month - 1] = [];
      varByMonth[month - 1].push({ year, variance });
      return varByMonth;
    }, []
  );

  const totalYears = varianceByMonth.reduce(
    (numOfYears, month) => month.length > numOfYears ? month.length : numOfYears, 0
  );
  const minYear = d3.min(monthlyVariance.map(({ year }) => year));

  const temperatures = monthlyVariance.map(({ variance }) => baseTemperature + variance);
  const temperatureDomain = [Math.floor(d3.min(temperatures)), Math.ceil(d3.max(temperatures))];

  svg
    .setColorScale(temperatureDomain)
    .setLinearScale([0, totalYears], [0, heatMapWidth]);


  // Actual Data Mapping
  varianceByMonth.forEach((month = [], i) => {
    svg.appendHeatMap({
      data: month.map(({ variance }) => baseTemperature + variance),
      width: 7,
      height: heatMapRowHeight,
      y: i * (heatMapRowHeight + 0.5),
      shift: {
        x: svgPadding + monthsFontSize * (maxLengthMonth + 1),
        y: svgPadding
      }
    });
  });

  const allRowsHeight = (heatMapRowHeight + 0.5) * varianceByMonth.length;

  // Axes
  const xAxis = d3.axisBottom()
    .scale(svg.linearScale)
    .tickValues(d3.range(7, totalYears, 10))
    .tickFormat(num => num + minYear);

  const xAxisText = 'Years';

  svg
    .appendAxisX(xAxis, {
      x: svgPadding + monthsFontSize * (maxLengthMonth + 1),
      y: allRowsHeight + svgPadding
    })
    .appendTextGroup({
      data: [xAxisText],
      shift: {
        x: svgPadding + heatMapWidth / 2 + monthsFontSize * (maxLengthMonth + 1),
        y: allRowsHeight + svgPadding + 3 * axesFontSize
      },
      fontSize: axesFontSize,
      className: axesText
    });

  svg
    .labelMonths({
      data: monthsAsText,
      shift: {
        x: svgPadding + monthsFontSize * maxLengthMonth,
        y: svgPadding + heatMapRowHeight * 0.5
      },
      offset: { x: 0, y: heatMapRowHeight + 0.5 }
    });


  // Legend
  svg
    .unsetLinearScale()
    .appendHeatMap({
      data: d3.range(temperatureDomain[0], temperatureDomain[1] + 1, 1),
      width: legendBlockWidth,
      height: legendBlockHeight,
      y: svgHeight - legendBlockHeight - legendFontSize - svgPadding,
      shift: { x: svgPadding, y: 0 }
    })
    .appendTextGroup({
      data: d3.range(temperatureDomain[0], temperatureDomain[1] + 1, 1),
      offset: {
        x: legendBlockWidth,
        y: 0
      },
      shift: {
        x: legendBlockWidth / 2 - legendFontSize / 2 + svgPadding,
        y: svgHeight - svgPadding
      },
      className: legendText,
      fontSize: legendFontSize
    });

  loading.removeFromNode(app);
  svg.appendToNode(app);
};



fetch(url)
  .then(response => {
    if (response.status >= 200 && response.status < 300) return response;
    else {
      const error = new Error(`${response.status} ${response.statusText}`);
      throw error;
    }
  })
  .then(response => response.json())
  .then(buildHeatMap)
  .catch(({ message }) => app.textContent = message);
