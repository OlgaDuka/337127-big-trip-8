import {EVENT_TYPES} from '../utils/index.js';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;
const COUNT_STAT = 3;

export default class Stat {
  constructor() {
    this._element = [];
    this._config = [];
    this._ctx = [];
  }

  set config(data) {
    for (let i = 0; i < COUNT_STAT; i += 1) {
      this._ctx[i] = document.querySelector(data.stat[i].selector);
      this._config[i] = {
        _title: data.stat[i].title,
        _unit: data.stat[i].unit,
        _arrPoints: this[data.stat[i].method](data.events),
      };
      this._ctx[i].height = BAR_HEIGHT * this._config[i]._arrPoints.numPoints;
    }
  }

  _getPriceOffers(arr, item) {
    let price = 0;
    arr[item].offers.forEach((elem) => {
      if (elem.accepted) {
        price += parseInt(elem.price, 10);
      }
    });
    return price;
  }

  getPointsMoney(arr) {
    const arrType = [];
    const arrPrice = [];
    arr.forEach((elem, i) => {
      let item = arrType.indexOf(`${EVENT_TYPES[elem.type].icon} ${elem.type.toUpperCase()}`);
      if (item === -1) {
        arrType.push(`${EVENT_TYPES[elem.type].icon} ${elem.type.toUpperCase()}`);
        arrPrice.push(elem.price + this._getPriceOffers(arr, i));
      } else {
        arrPrice[item] += (elem.price + this._getPriceOffers(arr, i));
      }
    });
    const count = arrType.length;
    return {labels: arrType, data: arrPrice, numPoints: count};
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
      let item = arrLabel.indexOf(`${EVENT_TYPES[elem.type].icon} ${elem.type.toUpperCase()}`);
      if (item === -1) {
        arrLabel.push(`${EVENT_TYPES[elem.type].icon} ${elem.type.toUpperCase()}`);
        arrHour.push(this._getDurationHour(arr, i));
      } else {
        arrHour[item] += this._getDurationHour(arr, i);
      }
    });
    const count = arrLabel.length;
    return {labels: arrLabel, data: arrHour, numPoints: count};
  }

  getPointsTransport(arr) {
    const arrType = [];
    const arrNum = [];
    arr.forEach((elem) => {
      let item = arrType.indexOf(`${EVENT_TYPES[elem.type].icon} ${elem.type.toUpperCase()}`);
      if ((item === -1) && (EVENT_TYPES[elem.type].add === `to`)) {
        arrType.push(`${EVENT_TYPES[elem.type].icon} ${elem.type.toUpperCase()}`);
        arrNum.push(1);
      } else {
        arrNum[item] += 1;
      }
    });
    const count = arrType.length;
    return {labels: arrType, data: arrNum, numPoints: count};
  }

  update(dataEvent, dataStat) {
    this._config.forEach((elem, i) => {
      elem._arrPoints = this[dataStat[i].method](dataEvent);
      this._element[i].data.labels = elem._arrPoints.labels;
      this._element[i].data.datasets.data = elem._arrPoints.data;
      this._element[i].update();
    });
  }

  unrender() {
    this._element = null;
  }

  render() {
    for (let i = 0; i < COUNT_STAT; i += 1) {
      this._element[i] = new Chart(this._ctx[i], this._configChart(i));
    }
    return this._element;
  }

  _configChart(item) {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._config[item]._arrPoints.labels,
        datasets: [{
          data: this._config[item]._arrPoints.data,
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
            formatter: (val) => `${val}${this._config[item]._unit}`
          }
        },
        destination: {
          display: true,
          text: this._config[item]._title,
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
