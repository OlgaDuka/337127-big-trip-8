import {EVENT_TYPES} from '../utils/index';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TotalCost from './total-cost';

const BAR_HEIGHT = 60;
const COUNT_STAT = 3;

export default class Stat {
  constructor() {
    this._element = [];
    this._config = [];
    this._container = [];
    this._ctx = [];
  }

  set config(data) {
    for (let i = 0; i < COUNT_STAT; i += 1) {
      this._container[i] = document.querySelector(data.stat[i].selectorParent);
      this._ctx[i] = this._container[i].querySelector(data.stat[i].selector);
      this._config[i] = {
        _title: data.stat[i].title,
        _unit: data.stat[i].unit,
        _arrPoints: this[data.stat[i].method](data.events),
      };
      this._ctx[i].height = BAR_HEIGHT * this._config[i]._arrPoints.numPoints;
      this._container[i].style = `height: ${this._ctx[i].height}px`;
    }
  }

  getPointsMoney(arr) {
    const arrType = [];
    const arrPrice = [];
    arr.forEach((elem) => {
      let item = arrType.indexOf(Stat.getStrLabel(elem));
      if (item === -1) {
        arrType.push(Stat.getStrLabel(elem));
        arrPrice.push(elem.price + TotalCost.getPricePointOffers(elem.offers));
      } else {
        arrPrice[item] += (elem.price + TotalCost.getPricePointOffers(elem.offers));
      }
    });
    const count = arrType.length;
    return {labels: arrType, data: arrPrice, numPoints: count};
  }

  getPointsTimeSpend(arr) {
    const arrLabel = [];
    const arrHour = [];
    arr.forEach((elem, i) => {
      let item = arrLabel.indexOf(Stat.getStrLabel(elem));
      if (item === -1) {
        arrLabel.push(Stat.getStrLabel(elem));
        arrHour.push(Stat.getDurationHour(arr, i));
      } else {
        arrHour[item] += Stat.getDurationHour(arr, i);
      }
    });
    const count = arrLabel.length;
    return {labels: arrLabel, data: arrHour, numPoints: count};
  }

  getPointsTransport(arr) {
    const arrType = [];
    const arrNum = [];
    arr.forEach((elem) => {
      let item = arrType.indexOf(Stat.getStrLabel(elem));
      if ((item === -1) && (EVENT_TYPES[elem.type].add === `to`)) {
        arrType.push(Stat.getStrLabel(elem));
        arrNum.push(1);
      } else {
        arrNum[item] += 1;
      }
    });
    const count = arrType.length;
    return {labels: arrType, data: arrNum, numPoints: count};
  }

  update(data) {
    for (let i = 0; i < COUNT_STAT; i += 1) {
      this._config[i]._arrPoints = this[data.stat[i].method](data.events);
      this._element[i].config.data.labels = this._config[i]._arrPoints.labels;
      this._element[i].config.data.datasets[0].data = this._config[i]._arrPoints.data;
      this._element[i].chart.update();
      this._ctx[i].height = BAR_HEIGHT * this._config[i]._arrPoints.numPoints;
      this._container[i].style = `height: ${this._ctx[i].height}px`;
    }
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
        maintainAspectRatio: false,
        responsive: true,
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

  static getDurationHour(arr, item) {
    const duration = moment.duration(moment(arr[item].timeStop).diff(moment(arr[item].timeStart)));
    return duration.days() * 24 + duration.hours() + (duration.minutes() > 30 ? 1 : 0);
  }

  static getStrLabel(point) {
    return `${EVENT_TYPES[point.type].icon} ${point.type.toUpperCase()}`;
  }
}
