import {StatData} from '../utils/index';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;

export default class Stat {
  constructor(data, numProp) {
    this._element = null;
    this._ctx = document.querySelector(StatData[numProp].selector);
    this._destination = StatData[numProp].destination;
    this._unit = StatData[numProp].unit;
    this._numPoints = data.length;
    this._ctx.height = BAR_HEIGHT * this._numPoints;
    this._arrPoints = this[StatData[numProp].method](data);
  }

  _getPriceOffers(arr, item) {
    let price = 0;
    arr[item].offers.forEach((elem) => {
      if (elem[2]) {
        price += parseInt(elem[1], 10);
      }
    });
    return price;
  }

  getPointsMoney(arr) {
    const arrType = [];
    const arrPrice = [];
    arr.forEach((elem, i) => {
      let item = arrType.indexOf(`${elem.type[1]} ${elem.type[0].toUpperCase()}`);
      if (item === -1) {
        arrType.push(`${elem.type[1]} ${elem.type[0].toUpperCase()}`);
        arrPrice.push(elem.price + this._getPriceOffers(arr, i));
      } else {
        arrPrice[item] += (elem.price + this._getPriceOffers(arr, i));
      }
    });
    return {
      labels: arrType,
      data: arrPrice
    };
  }

  _getDurationHour(arr, item) {
    const dateStart = moment(arr[item].timeStart);
    const dateEnd = moment(arr[item].timeStop);
    const duration = moment.duration(dateEnd.diff(dateStart));
    return duration.hours();
  }

  getPointsTimeSpend(arr) {
    const arrLabel = [];
    const arrHour = [];
    arr.forEach((elem, i) => {
      let item = arrLabel.indexOf(`${elem.type[1]} ${elem.destination.toUpperCase()}`);
      if (item === -1) {
        arrLabel.push(`${elem.type[1]} ${elem.destination.toUpperCase()}`);
        arrHour.push(this._getDurationHour(arr, i));
      } else {
        arrHour[item] += this._getDurationHour(arr, i);
      }
    });
    return {
      labels: arrLabel,
      data: arrHour
    };
  }

  getPointsTransport(arr) {
    const arrType = [];
    const arrNum = [];
    arr.forEach((elem) => {
      let item = arrType.indexOf(`${elem.type[1]} ${elem.type[0].toUpperCase()}`);
      if ((item === -1) && (elem.type[2] === `to`)) {
        arrType.push(`${elem.type[1]} ${elem.type[0].toUpperCase()}`);
        arrNum.push(1);
      } else {
        arrNum[item] += 1;
      }
    });
    return {
      labels: arrType,
      data: arrNum
    };
  }

  update(data, numProp) {
    const arr = data.events.filter((it) => !it.isDeleted);
    this._arrPoints = this[StatData[numProp].method](arr);
    this._element.data.labels = this._arrPoints.labels;
    this._element.data.datasets.data = this._arrPoints.data;
    this._element.update();
  }

  unrender() {
    this._element = null;
  }

  render() {
    this._element = new Chart(this._ctx, this.configChart);
    return this._element;
  }

  get configChart() {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._arrPoints.labels,
        datasets: [{
          data: this._arrPoints.data,
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
            formatter: (val) => `${val}${this._unit}`
          }
        },
        destination: {
          display: true,
          text: this._destination,
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
    };
  }
}
