import {EVENT_TYPES} from '../utils/index.js';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;
const TypeStat = {
  MONEY: 0,
  TRANSPORT: 1,
  TIME_SPEND: 2
};

export default class Stat {
  constructor() {
    this._element = [];
    this._config = [];
    this._ctx = [];
  }

  set money(data) {
    this._ctx[TypeStat.MONEY] = document.querySelector(data.stat[TypeStat.MONEY].selector);
    this._config[TypeStat.MONEY] = {
      _title: data.stat[TypeStat.MONEY].title,
      _unit: data.stat[TypeStat.MONEY].unit,
      _arrPoints: this[data.stat[TypeStat.MONEY].method](data.events),
    };
    this._ctx[TypeStat.MONEY].height = BAR_HEIGHT * this._config[TypeStat.MONEY]._arrPoints.numPoints;
  }

  set transport(data) {
    this._ctx[TypeStat.TRANSPORT] = document.querySelector(data.stat[TypeStat.TRANSPORT].selector);
    this._config[TypeStat.TRANSPORT] = {
      _title: data.stat[TypeStat.TRANSPORT].title,
      _unit: data.stat[TypeStat.TRANSPORT].unit,
      _arrPoints: this[data.stat[TypeStat.TRANSPORT].method](data.events)
    };
    this._ctx[TypeStat.TRANSPORT].height = BAR_HEIGHT * this._config[TypeStat.TRANSPORT]._arrPoints.numPoints;
  }

  set timeSpend(data) {
    this._ctx[TypeStat.TIME_SPEND] = document.querySelector(data.stat[TypeStat.TIME_SPEND].selector);
    this._config[TypeStat.TIME_SPEND] = {
      _title: data.stat[TypeStat.TIME_SPEND].title,
      _unit: data.stat[TypeStat.TIME_SPEND].unit,
      _arrPoints: this[data.stat[TypeStat.TIME_SPEND].method](data.events),
    };
    this._ctx[TypeStat.TIME_SPEND].height = BAR_HEIGHT * this._config[TypeStat.TIME_SPEND]._arrPoints.numPoints;
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
    return {
      labels: arrType,
      data: arrPrice,
      numPoints: count
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
      let item = arrLabel.indexOf(`${EVENT_TYPES[elem.type].icon} ${elem.type.toUpperCase()}`);
      if (item === -1) {
        arrLabel.push(`${EVENT_TYPES[elem.type].icon} ${elem.type.toUpperCase()}`);
        arrHour.push(this._getDurationHour(arr, i));
      } else {
        arrHour[item] += this._getDurationHour(arr, i);
      }
    });
    const count = arrLabel.length;
    return {
      labels: arrLabel,
      data: arrHour,
      numPoints: count
    };
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
    return {
      labels: arrType,
      data: arrNum,
      numPoints: count
    };
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
    this._element[TypeStat.MONEY] = new Chart(this._ctx[TypeStat.MONEY], this.configChart(TypeStat.MONEY));
    this._element[TypeStat.TRANSPORT] = new Chart(this._ctx[TypeStat.TRANSPORT], this.configChart(TypeStat.TRANSPORT));
    this._element[TypeStat.TIME_SPEND] = new Chart(this._ctx[TypeStat.TIME_SPEND], this.configChart(TypeStat.TIME_SPEND));
    return this._element;
  }

  configChart(typeStat) {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._config[typeStat]._arrPoints.labels,
        datasets: [{
          data: this._config[typeStat]._arrPoints.data,
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
            formatter: (val) => `${val}${this._config[typeStat]._unit}`
          }
        },
        destination: {
          display: true,
          text: this._config[typeStat]._title,
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
