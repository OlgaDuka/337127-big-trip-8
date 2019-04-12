import Component from './component.js';

export default class TripDay extends Component {
  constructor(data) {
    super();
    this._day = data;
  }

  get template() {
    return `<section class="trip-day">
              <article class="trip-day__info">
                <span class="trip-day__caption">Day</span>
                <p class="trip-day__number">${this._getDay()}</p>
                <h2 class="trip-day__title">${this._day.substring(2)}</h2>
              </article>
              <div class="trip-day__items">

              </div>
            </section>`.trim();
  }

  _getDay() {
    return this._day.substring(0, 2)[0] === `0` ? this._day.substring(1, 2) : this._day.substring(0, 2);
  }

  update(data) {
    this._day = data;
  }
}
