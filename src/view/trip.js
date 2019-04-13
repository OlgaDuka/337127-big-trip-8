import {EVENT_TYPES} from '../utils/index.js';
import moment from 'moment';
import Component from './component.js';
import TotalCost from './total-cost';

export default class Trip extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._destination = data.destination;
    this._timeStart = data.timeStart;
    this._timeStop = data.timeStop;

    this.offers = data.offers;
    this.price = data.price;

    this._onClick = null;

    this._onPointClick = this._onPointClick.bind(this);
  }

  set onClick(fn) {
    this._onClick = fn;
  }

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

  _getDuration() {
    const duration = moment.duration(moment(this._timeStop).diff(moment(this._timeStart)));
    const days = duration.days();
    return days > 0 ? `${days}D ${duration.hours()}H ${duration.minutes()}M` : `${duration.hours()}H ${duration.minutes()}M`;
  }

  _getTimeStr() {
    return `${moment(this._timeStart).format(`H:mm`)}&nbsp;&mdash;&nbsp;${moment(this._timeStop).format(`H:mm`)}`;
  }

  update(point) {
    this._type = point.type;
    this._destination = point.destination;
    this._timeStart = point.timeStart;
    this._timeStop = point.timeStop;
    this.price = point.price;
    this.offers = point.offers;
  }

  _onPointClick() {
    return (typeof this._onClick === `function`) && this._onClick();
  }

  bind() {
    this._element.addEventListener(`click`, this._onPointClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onPointClick);
  }
}
