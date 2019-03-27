import moment from 'moment';
import Component from './component.js';

export default class Trip extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._title = data.title;
    this._price = data.price;
    this._day = data.day;
    this._timeStart = data.timeStart;
    this._timeStop = data.timeStop;
    this._picture = data.picture;
    this._offers = data.offers;
    this._description = data.description;
    this._isFavorite = data.isFavorite;
    this._isCollapse = data.isCollapse;

    this._onClick = null;

    this._onPointClick = this._onPointClick.bind(this);
  }

  _onPointClick() {
    return (typeof this._onClick === `function`) && this._onClick();
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

  update(data) {
    this._type = data.type;
    this._title = data.title;
    this._price = data.price;
    this._day = data.day;
    this._timeStart = data.timeStart;
    this._timeStop = data.timeStop;
    this._offers = data.offers;
    this._description = data.description;
    this._picture = data.picture;
  }

  get price() {
    const offersTotalPrice = this._offers.filter((offer) => offer[2] === true).reduce((acc, offer) => acc + parseInt(offer[1], 10), 0);
    return +this._price + offersTotalPrice;
  }


  _getOffer() {
    let htmlOffers = ``;
    this._offers.map((offer) => {
      if (offer[2]) {
        htmlOffers += `<li>
          <button class="trip-point__offer">${offer[0]} +&euro;&nbsp;${offer[1]}</button>
          </li>`;
      }
    });
    return htmlOffers;
  }

  getDuration() {
    const duration = moment.duration(moment(this._timeStop).diff(moment(this._timeStart)));
    return `${duration.hours()}H:${duration.minutes()}M`;
  }

  getTimeStr() {
    return `${moment(this._timeStart).format(`H:mm`)}&nbsp;&mdash;&nbsp;${moment(this._timeStop).format(`H:mm`)}`;
  }

  get template() {
    return `<article class="trip-point">
                <i class="trip-icon">${this._type[1]}</i>
                <h3 class="trip-point__title">${this._type[0]} ${this._type[2]} ${this._title}</h3>
                <p class="trip-point__schedule">
                  <span class="trip-point__timetable">${this.getTimeStr()}</span>
                  <span class="trip-point__duration">${this.getDuration()}</span>
                </p>
                <p class="trip-point__price">&euro;&nbsp;${this.price}</p>
                <ul class="trip-point__offers">
                  ${this._getOffer()}
                </ul>
              </article>`.trim();
  }
}
