import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {arrTripEvents} from "./data";

const moneyCtx = document.querySelector(`.statistic__money`);
const numPoints = arrTripEvents.length;

const BAR_HEIGHT = 55;
moneyCtx.height = BAR_HEIGHT * numPoints;

const moneyStatData = {
  labels: arrTripEvents.map(({type}) => `${type[1]} ${type[0].toUpperCase()}`),
  data: arrTripEvents.map((item) => item.price)
};

export const moneyStat = new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: moneyStatData.labels,
    datasets: [{
      data: moneyStatData.data,
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `€ ${val}`
      }
    },
    title: {
      display: true,
      text: `MONEY`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: true
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: true
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});
