import {EVENT_TYPES} from '../utils/index.js';
import moment from 'moment';
import Component from './component.js';
import TotalCost from './total-cost';

/**
 * @description Класс компонента точки маршрута
 * @export
 * @class Trip
 * @extends {Component}
 */
export default class Trip extends Component {
  /**
   * @description Конструктор класса
   * @param {Object} data данные для отрисовки точки маршрута в списке точек
   * @member Trip
   */
  constructor(data) {
    super();
    this.data = data;

    this._type = data.type;
    this._destination = data.destination;
    this._timeStart = data.timeStart;
    this._timeStop = data.timeStop;

    this.offers = data.offers;
    this.price = data.price;

    this._onClick = null;
    this._onSubmit = null;

    this._onPointClick = this._onPointClick.bind(this);
    this._onOfferClick = this._onOfferClick.bind(this);
  }

  /**
   * @description Сеттер - устанавливает коллбэк-функцию для реакции на клик по элементу
   * @param {Function} fn
   * @member Trip
   */
  set onClick(fn) {
    this._onClick = fn;
  }

  /**
   * @description Сеттер - устанавливает коллбэк-функцию для добавления предложения к точке маршрута
   * @param {Function} fn
   * @member Trip
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }


  /**
   * @description Геттер - создание шаблона компонента
   * @return {Node} DOM-элемент <template>
   * @member Trip
   */
  get template() {
    return `<article class="trip-point">
              <i class="trip-icon">${EVENT_TYPES[this._type].icon}</i>
              <h3 class="trip-point__title">${this._type} ${EVENT_TYPES[this._type].add} ${this._destination}</h3>
              <p class="trip-point__schedule">
                <span class="trip-point__timetable">${this._getTimeStr()}</span>
                <span class="trip-point__duration">${this._getDuration()}</span>
              </p>
              <p class="trip-point__price">&euro;&nbsp;${TotalCost.getPricePoint(this)}</p>
              <ul class="trip-point__offers">
                ${this._getOffer()}
              </ul>
            </article>`.trim();
  }

  /**
   * @description Формирует список предложений, доступных для выбора, для вывода в шаблон
   * @return {Node} DOM-элемент <template>
   * @member Trip
   */
  _getOffer() {
    let htmlOffers = ``;
    const num = this.offers.length > 3 ? 3 : this.offers.length;
    if (num > 0) {
      for (let i = 0; i < num; i += 1) {
        if (!this.offers[i].accepted) {
          htmlOffers += `<li><button class="trip-point__offer">${this.offers[i].title} +&euro;&nbsp;${this.offers[i].price}</button></li>`;
        }
      }
    }
    return htmlOffers;
  }

  /**
   * @description Формирует строку длительности точки маршрута для вывода в шаблон
   * @return {String} строка, содержит длительность в днях (если > 24 часов), часах и минутах
   * @member Trip
   */
  _getDuration() {
    const duration = moment.duration(moment(this._timeStop).diff(moment(this._timeStart)));
    const days = duration.days();
    return days > 0 ? `${days}D ${duration.hours()}H ${duration.minutes()}M` : `${duration.hours()}H ${duration.minutes()}M`;
  }

  /**
   * @description Формирует строку с временем для вывода в шаблон начала и завершения точки маршрута
   * @return {String} строка, содержит время в формате "00:00 - 00:00"
   * @member Trip
   */
  _getTimeStr() {
    return `${moment(this._timeStart).format(`H:mm`)}&nbsp;&mdash;&nbsp;${moment(this._timeStop).format(`H:mm`)}`;
  }

  /**
   * @description Обновляет данные точки маршрута
   * @param {Object} point новые данные, полученные в результате редактирования точки маршрута
   * @member Trip
   */
  update(point) {
    this._type = point.type;
    this._destination = point.destination;
    this._timeStart = point.timeStart;
    this._timeStop = point.timeStop;
    this.price = point.price;
    this.offers = point.offers;
  }

  /**
   * @description Обработчик события `click` компонента
   * @return {Function}
   * @member Trip
   */
  _onPointClick() {
    return (typeof this._onClick === `function`) && this._onClick();
  }

  /**
   * @description Обработчик события `click` по кнопке с предложением
   * @return {Function}
   * @member Trip
   */
  _onOfferClick({target}) {
    if (typeof this._onSubmit === `function`) {
      for (const offer of this.data.offers) {
        if (offer.title === target.value) {
          offer.accepted = target.checked;
          break;
        }
      }
      this.price = TotalCost.getPricePoint(this.data);
      this._onSubmit(this.data);
    }
  }

  /**
   * @description Установка обработчика события
   * @member Trip
   */
  bind() {
    this._element.addEventListener(`click`, this._onPointClick);

    const offers = this._element.querySelectorAll(`.point__offers-input`);
    [].forEach.call(offers, (element) => {
      element.addEventListener(`click`, this._onOfferClick);
    });

  }

  /**
   * @description Снятие обработчика события
   * @member Trip
   */
  unbind() {
    this._element.removeEventListener(`click`, this._onPointClick);

    const offers = this._element.querySelectorAll(`.point__offers-input`);
    [].forEach.call(offers, (element) => {
      element.removeEventListener(`click`, this._onOfferClick);
    });

  }
}
