/* eslint no-unused-vars: off */
import range from 'lodash/range';
import partial from 'lodash/partial';
import min from 'lodash/min';
import max from 'lodash/max';

import {
  heatMap as heatMapClass,
  legendText
} from './heatMap.scss';

import Svg from './Svg';
import Loading from './Loading';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const heatMapWidth = window.screen.width * 0.9;
const legendBlockWidth = 50;
const legendBlockHeight = 20;
const legendFontSize = 14;

const app = document.getElementById('app');

const loading = new Loading();

loading.appendToNode(app);
loading.startAnimation();

const svg = new Svg(heatMapClass);



fetch(url)
  .then(response => {
    if (response.status >= 200 && response.status < 300) return response;
    else {
      const error = new Error(`${response.status} ${response.statusText}`);
      throw error;
    }
  })
  .then(response => response.json())
  .then(data => {
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

    const temperatures = monthlyVariance.map(({ variance }) => baseTemperature + variance);
    const temperatureDomain = [Math.floor(min(temperatures)), Math.ceil(max(temperatures))];

    svg
      .setColorScale(temperatureDomain)
      // Legend
      .appendHeatMap({
        data: range(temperatureDomain[0], temperatureDomain[1] + 1, 1),
        width: legendBlockWidth,
        height: legendBlockHeight
      })
      .appendTextGroup({
        data: range(temperatureDomain[0], temperatureDomain[1] + 1, 1),
        offset: {
          x: legendBlockWidth,
          y: legendBlockHeight + 14
        },
        shift: { x: legendBlockWidth / 2 - legendFontSize / 2, y: 0 },
        className: legendText,
        fontSize: legendFontSize
      })
      .setLinearScale([0, totalYears], [0, heatMapWidth]);



    // Actual Data Mapping
    varianceByMonth.forEach((month = [], i) => {
      svg.appendHeatMap({
        data: month.map(({ variance }) => baseTemperature + variance),
        width: 8,
        height: 20,
        y: (i + 1) * 25 + 20
      });
    });


    loading.removeFromNode(app);
    svg.appendToNode(app);
  })
  .catch(({ message }) => app.textContent = message);
