import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {arrTripEvents} from "./data";

const transportCtx = document.querySelector(`.statistic__transport`);
const numPoints = arrTripEvents.length;

const BAR_HEIGHT = 55;
transportCtx.height = BAR_HEIGHT * numPoints;

const getPoints = () => {
  const arrType = [];
  const arrNum = [];
  arrTripEvents.forEach((elem) => {
    let item = arrType.indexOf(elem.type);
    if ((item === -1) && (elem.type[2] === `to`)) {
      arrType.push(elem.type);
      arrNum.push(1);
    } else {
      arrNum[item] += 1;
    }
  });
  return {
    labels: arrType,
    data: arrNum
  };
};

const arrPoints = getPoints();

const transportStatData = {
  labels: arrPoints.labels.map((elem) => `${elem[1]} ${elem[0].toUpperCase()}`),
  data: arrPoints.data
};

export const transportStat = new Chart(transportCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: transportStatData.labels,
    datasets: [{
      data: transportStatData.data,
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
        formatter: (val) => `${val}x`
      }
    },
    title: {
      display: true,
      text: `TRANSPORT`,
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
          drawBorder: false
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
          drawBorder: false
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
