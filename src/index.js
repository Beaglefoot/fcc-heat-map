import flatten from 'lodash/flatten';
import round from 'lodash/round';

import {
  heatMap as heatMapClass,
  legendText,
  axesText,
  monthsText,
  title,
  subtitle,
  description,
  loadingText,
  dataRect
} from './index.scss';

import Svg from './Svg/Svg';
import Loading from './Loading/Loading';
import tip from './tip/tip';
import Footer from './Footer/Footer';

const d3 = require('d3');

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const svgWidth = 1500;
const svgHeight = 750;
const svgPadding = 20;
const heatMapRowHeight = 40;
const legendBlockWidth = 35;
const legendBlockHeight = 20;
const legendFontSize = 12;
const axesFontSize = 16;
const monthsAsText = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthsFontSize = 14;
const maxLengthMonth = d3.max(monthsAsText, d => d.length);
const heatMapWidth = svgWidth - svgPadding * 2 - 2 * (monthsFontSize * (maxLengthMonth + 1));
const titleFontSize = 28;
const subtitleFontSize = 22;
const descriptionFontSize = 12;
const xAxisFontSize = 12;
const totalOffsetTop = svgPadding + titleFontSize + 2 * subtitleFontSize + 2 * descriptionFontSize;

const footer = new Footer();
footer.appendToDocument();

const app = document.getElementById('app');

const loading = new Loading();

loading.addClass(loadingText);
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
        y: totalOffsetTop
      },
      className: dataRect
    });
  });


  // Hover tip
  svg.svg.call(tip)
    .selectAll(`.${dataRect}`)
    .data(flatten(varianceByMonth))
    .on('mouseover', (d, i) => {
      tip.show(''.concat(
        `${monthsAsText[Math.floor(i / totalYears)]} ${d.year}`,
        '<br>',
        round(baseTemperature + d.variance, 3),
        '°C',
        '<br>',
        (variance => variance > 0 ? `+${variance}` : variance)(round(d.variance, 3))
      )).style('text-align', 'center');
    })
    .on('mouseout', () => tip.hide());



  const allRowsHeight = (heatMapRowHeight + 0.5) * varianceByMonth.length;

  // Axes
  const xAxis = d3.axisBottom()
    .scale(svg.linearScale)
    .tickValues(d3.range(7, totalYears, 10))
    .tickFormat(num => num + minYear);

  svg
    .appendAxisX({ xAxis, fontSize: xAxisFontSize, offset: {
      x: svgPadding + monthsFontSize * (maxLengthMonth + 1),
      y: allRowsHeight + totalOffsetTop
    }})
    .appendTextGroup({
      data: ['Years'],
      shift: {
        x: svgPadding + heatMapWidth / 2 + monthsFontSize * (maxLengthMonth + 1),
        y: allRowsHeight + 3 * axesFontSize + totalOffsetTop
      },
      fontSize: axesFontSize,
      className: axesText
    });

  svg
    .appendTextGroup({
      data: monthsAsText,
      shift: {
        x: svgPadding + monthsFontSize * maxLengthMonth,
        y: heatMapRowHeight * 0.5 + totalOffsetTop
      },
      offset: { x: 0, y: heatMapRowHeight + 0.5 },
      fontSize: monthsFontSize,
      className: monthsText
    });


  // Legend
  const legendBlocks = d3.range(temperatureDomain[0], temperatureDomain[1] + 1, 1);
  svg
    .unsetLinearScale()
    .appendHeatMap({
      data: legendBlocks,
      width: legendBlockWidth,
      height: legendBlockHeight,
      y: svgHeight - legendBlockHeight - legendFontSize - svgPadding,
      shift: { x: svgWidth - (svgWidth - heatMapWidth) / 2 - legendBlockWidth * legendBlocks.length, y: 0 }
    })
    .appendTextGroup({
      data: d3.range(temperatureDomain[0], temperatureDomain[1] + 1, 1),
      offset: {
        x: legendBlockWidth,
        y: 0
      },
      shift: {
        x: svgWidth - (svgWidth - heatMapWidth) / 2 - (legendBlockWidth * legendBlocks.length) + (legendBlockWidth / 2),
        y: svgHeight - svgPadding
      },
      className: legendText,
      fontSize: legendFontSize
    });


  // Title
  svg
    .appendTextGroup({
      data: ['Monthly Global Land-Surface Temperature'],
      shift: {
        x: svgWidth / 2,
        y: svgPadding + titleFontSize
      },
      fontSize: titleFontSize,
      className: title
    })
    .appendTextGroup({
      data: ['1753 - 2015'],
      shift: {
        x: svgWidth / 2,
        y: svgPadding + 2 * titleFontSize
      },
      fontSize: subtitleFontSize,
      className: subtitle
    })
    .appendTextGroup({
      data: [
        'Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.',
        'Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07'
      ],
      offset: { x: 0, y: descriptionFontSize },
      shift: {
        x: svgWidth / 2,
        y: svgPadding + titleFontSize + subtitleFontSize + descriptionFontSize * 2
      },
      fontSize: descriptionFontSize,
      className: description
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
