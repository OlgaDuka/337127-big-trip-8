import {getRandomInRange, getTime, createElement, Price} from './utils/index.js';

class Trip {
  constructor(data) {
    this._type = data.type;
    this._title = data.title;
    this._day = data.day;
    this._timeStart = data.timeStart;
    this._timeStop = data.timeStop;
    this._picture = data.picture;
    this._offers = data.offers;
    this._destinations = data.destinations;
    this._isFavorite = data.isFavorite;
    this._isCollapse = data.isCollapse;

    this._element = null;
    this._onClick = null;

    this._onPointClick = this._onPointClick.bind(this);
  }

  _onPointClick() {
    return (typeof this._onClick === `function`) && this._onClick();
  }

  get element() {
    return this._element;
  }

  getOffer() {
    return this._offers.map((offer) => `<li>
        <button class="trip-point__offer">${offer} +&euro;&nbsp;${getRandomInRange(Price.MIN_PRICE_OFFER, Price.MAX_PRICE_OFFER)}</button>
      </li>`).join(``);
  }

  getDuration() {
    let stroke = new Date(this._timeStop - this._timeStart);
    let hours = `${stroke.toLocaleString(`en-US`, {hour: `2-digit`, hour12: false})}H `;
    let minutes = `${stroke.toLocaleString(`en-US`, {minute: `2-digit`})}M`;
    return hours + minutes;
  }

  getNamePoint() {
    const arrResult = document.querySelector(`.trip__points`).textContent.split(`— `);
    const maxIndex = arrResult.length - 1;
    return [arrResult, maxIndex];
  }

  get template() {
    return `<article class="trip-point">
                <i class="trip-icon">${this._type[1]}</i>
                <h3 class="trip-point__title">${this._type[0]} to ${this.getNamePoint()[0][getRandomInRange(0, this.getNamePoint()[1])]}</h3>
                <p class="trip-point__schedule">
                  <span class="trip-point__timetable">${getTime(this._timeStart)}&nbsp;&mdash; ${getTime(this._timeStop)}</span>
                  <span class="trip-point__duration">${this.getDuration(this._timeStop, this._timeStart)}</span>
                </p>
                <p class="trip-point__price">&euro;&nbsp;${getRandomInRange(Price.MIN_PRICE_EVENT, Price.MAX_PRICE_EVENT)}</p>
                <ul class="trip-point__offers">
                  ${this.getOffer(this._offers)}
                </ul>
              </article>`.trim();
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  bind() {
    this._element.addEventListener(`click`, this._onPointClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onPointClick);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}

export {Trip};
