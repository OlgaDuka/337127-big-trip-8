import {EVENT_TYPES} from '../utils/index.js';
import moment from 'moment';
import Component from './component.js';

export default class Trip extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._destination = data.destination;
    this._price = data.price;
    this._timeStart = data.timeStart;
    this._timeStop = data.timeStop;
    this._pictures = data.pictures;
    this._offers = data.offers;
    this._description = data.description;
    this._isFavorite = data.isFavorite;

    this._state = {
      price: data.price,
    };

    this._onClick = null;

    this._onPointClick = this._onPointClick.bind(this);
  }

  _onPointClick() {
    return (typeof this._onClick === `function`) && this._onClick();
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  update() {
    this._price = this._state.price;
  }

  bind() {
    this._element.addEventListener(`click`, this._onPointClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onPointClick);
  }

  _getOffer() {
    let htmlOffers = ``;
    const num = this._offers.length > 3 ? 3 : this._offers.length;
    if (num > 0) {
      for (let i = 0; i < num; i += 1) {
        if (!this._offers[i].accepted) {
          htmlOffers += `<li><button class="trip-point__offer">${this._offers[i].title} +&euro;&nbsp;${this._offers[i].price}</button></li>`;
        }
      }
    }
    return htmlOffers;
  }

  getDuration() {
    const duration = moment.duration(moment(this._timeStop).diff(moment(this._timeStart)));
    const days = duration.days();
    return days > 0 ? `${days}D ${duration.hours()}H ${duration.minutes()}M` : `${duration.hours()}H ${duration.minutes()}M`;
  }

  getTimeStr() {
    return `${moment(this._timeStart).format(`H:mm`)}&nbsp;&mdash;&nbsp;${moment(this._timeStop).format(`H:mm`)}`;
  }

  get template() {
    return `<article class="trip-point">
              <i class="trip-icon">${EVENT_TYPES[this._type].icon}</i>
              <h3 class="trip-point__title">${this._type} ${EVENT_TYPES[this._type].add} ${this._destination}</h3>
              <p class="trip-point__schedule">
                <span class="trip-point__timetable">${this.getTimeStr()}</span>
                <span class="trip-point__duration">${this.getDuration()}</span>
              </p>
              <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
              <ul class="trip-point__offers">
                ${this._getOffer()}
              </ul>
            </article>`.trim();
  }
}
