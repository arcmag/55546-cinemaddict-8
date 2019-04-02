import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 70;

const statisticTextList = document.querySelector(`.statistic__text-list`);
const statisticCtx = document.querySelector(`.statistic__chart`);

let statisticChart = null;

const updateDataStatistic = ({totalFilms, totalTime, topGenre}) => {
  statisticTextList.innerHTML = `
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">
        ${totalFilms} <span class="statistic__item-description">movies</span>
      </p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">
        ${totalTime.hours} <span class="statistic__item-description">h</span>
        ${totalTime.minutes} <span class="statistic__item-description">m</span>
      </p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>`;
};

const getDataPriorityGenres = (films, genres) => {
  const data = (genres ? Array.from(genres) : []).reduce((obj, tag) => {
    obj[tag] = 0;
    return obj;
  }, {});

  films.forEach((it) => {
    it.genre.forEach((tag) => {
      data[tag]++;
    });
  });

  return data;
};

const chartUpdate = ({data, labels}) => {
  if (data) {
    statisticChart.data.datasets[0].data = data;
  }

  if (labels) {
    statisticChart.data.labels = Array.from(labels);
    statisticCtx.height = BAR_HEIGHT * statisticChart.data.labels.length;
  }

  statisticChart.update();
};

const createChart = () => {
  statisticChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [],
      datasets: [{
        data: [],
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
};

export {chartUpdate, getDataPriorityGenres, updateDataStatistic, createChart};
