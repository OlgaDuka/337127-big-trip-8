import {EVENT_TYPES} from '../utils/index';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TotalCost from './total-cost';

const BAR_HEIGHT = 60;
const COUNT_STAT = 3;

/**
 * @description Класс компонента для показа статистики
 * @export
 * @class Stat
 * @extends {Component}
 */
export default class Stat {
  /**
   * @description Конструктор класса
   * @member Stat
   */
  constructor() {
    this._element = [];
    this._config = [];
    this._container = [];
    this._ctx = [];
  }

  /**
   * @description Сеттер - заполняет конфиг для графиков статистики
   * @param {Array} data модель, используются данные всех точек events и массив stat
   * @member Stat
   */
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

  /**
   * @description Функция для создания имен чартов и расчета стоимости по типам точек маршрута
   * @param {Array} arr данные всех точек маршрута
   * @return {Object} массив лейб, массив стоимостей и количество чартов для расчета высоты графика
   * @member Stat
   */
  getPointsMoney(arr) {
    const arrType = [];
    const arrPrice = [];
    arr.forEach((elem) => {
      let item = arrType.indexOf(Stat.getStrLabel(elem));
      if (item === -1) {
        arrType.push(Stat.getStrLabel(elem));
        arrPrice.push(TotalCost.getPricePoint(elem));
      } else {
        arrPrice[item] += (TotalCost.getPricePoint(elem));
      }
    });
    const count = arrType.length;
    return {labels: arrType, data: arrPrice, numPoints: count};
  }

  /**
   * @description Функция для создания имен чартов и расчета времени по типам точек маршрута
   * @param {Array} arr данные всех точек маршрута
   * @return {Object} массив лейб, массив времен в часах и количество чартов для расчета высоты графика
   * @member Stat
   */
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

  /**
   * @description Функция для создания имен чартов и определения используемых видов транспорта в путешествии
   * @param {Array} arr данные всех точек маршрута
   * @return {Object} массив лейб, массив кол-ва раз использования видов транспорта и кол-во чартов
   * @member Stat
   */
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

  /**
   * @description Обновляет данные для вывода статистики
   * @param {Array} data модель, используются данные всех точек events и массив stat
   * @member Stat
   */
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

  /**
   * @description Отрисовывает графики со статистикой
   * @member Stat
   */
  render() {
    for (let i = 0; i < COUNT_STAT; i += 1) {
      this._element[i] = new Chart(this._ctx[i], this._configChart(i));
    }
    return this._element;
  }

  /**
   * @description Заполняет конфигурационный объект чарта для вывода статистики
   * @param {Array} item массив с данными для настройки чарта
   * @return {Object} с настройками для рисования графиков
   * @member Stat
   */
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

  /**
   * @description Получение длительности точки маршрута
   * @static
   * @param {Array} arr массив данных точек маршрута
   * @param {Integer} item элемент массива
   * @return {Integer} длительность в часах с округлением минут > 30 до целого часа
   * @member Stat
   */
  static getDurationHour(arr, item) {
    const duration = moment.duration(moment(arr[item].timeStop).diff(moment(arr[item].timeStart)));
    return duration.days() * 24 + duration.hours() + (duration.minutes() > 30 ? 1 : 0);
  }

  /**
   * @description Создание лейбы для чарта
   * @static
   * @param {Object} point объект данных точки маршрута
   * @return {String} строка, содержит иконку и название типа точки маршрута
   * @member Stat
   */
  static getStrLabel(point) {
    return `${EVENT_TYPES[point.type].icon} ${point.type.toUpperCase()}`;
  }
}
