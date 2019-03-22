import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {arrTripEvents} from "./data";

const moneyCtx = document.querySelector(`.statistic__money`);
const numPoints = arrTripEvents.length;

const BAR_HEIGHT = 55;
moneyCtx.height = BAR_HEIGHT * numPoints;

const getPriceOffers = (item) => {
  let price = 0;
  arrTripEvents[item].offers.forEach((elem) => {
    if (elem[2]) {
      price += parseInt(elem[1], 10);
    }
  });
  return price;
};

const getPoints = () => {
  const arrType = [];
  const arrPrice = [];
  arrTripEvents.forEach((elem, i) => {
    let item = arrType.indexOf(elem.type);
    if (item === -1) {
      arrType.push(elem.type);
      arrPrice.push(elem.price + getPriceOffers(i));
    } else {
      arrPrice[item] += (elem.price + getPriceOffers(i));
    }
  });
  return {
    labels: arrType,
    data: arrPrice
  };
};

const arrPoints = getPoints();

const moneyStatData = {
  labels: arrPoints.labels.map((elem) => `${elem[1]} ${elem[0].toUpperCase()}`),
  data: arrPoints.data
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
