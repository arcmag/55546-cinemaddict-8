import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {GENRES_LIST} from './data-card';
import {getWathedFilms} from './card-util';

const BAR_HEIGHT = 50;

const getDataPriorityGenres = (films) => {
  const data = GENRES_LIST.reduce((obj, tag) => {
    obj[tag] = 0;
    return obj;
  }, {});

  films.forEach((it) => {
    it._genre.forEach((tag) => {
      data[tag]++;
    });
  });

  return data;
};

const statisticCtx = document.querySelector(`.statistic__chart`);

statisticCtx.height = BAR_HEIGHT * 5;
const statisticChart = new Chart(statisticCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: GENRES_LIST,
    datasets: [{
      data: Object.values(getDataPriorityGenres(getWathedFilms())),
      backgroundColor: `#ffe800`,
      hoverBackgroundColor: `#ffe800`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20
        },
        color: `#ffffff`,
        anchor: `start`,
        align: `start`,
        offset: 40,
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#ffffff`,
          padding: 100,
          fontSize: 20
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 24
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  }
});

export {statisticChart, getDataPriorityGenres};
