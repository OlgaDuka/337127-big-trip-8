import flatpickr from 'flatpickr';
import Component from './component.js';

export default class TripOpen extends Component {
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

    this._onSubmit = null;
    this._onDelete = null;
    this._onKeyEsc = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onKeydownEsc = this._onKeydownEsc.bind(this);
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.point__form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  _onDeleteButtonClick() {
    return (typeof this._onDelete === `function`) && this._onDelete();
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _onKeydownEsc(evt) {
    return (typeof this._onKeyEsc === `function`) && (evt.keyCode === 27) && this._onKeyEsc();
  }

  set onKeyEsc(fn) {
    this._onKeyEsc = fn;
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _processForm(formData) {
    const entry = {
      type: ``,
      title: ``,
      price: 0,
      day: new Date(),
      timeStart: new Date(),
      timeStop: new Date(),
      offers: new Set(),
    };

    const pointEditMapper = TripOpen.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (pointEditMapper[property]) {
        pointEditMapper[property](value);
      }
    }
    return entry;
  }

  update(data) {
    this._type = data.type;
    this._title = data.title;
    this._price = data.price;
    this._day = data.day;
    this._timeStart = data.timeStart;
    this._timeStop = data.timeStop;
    this._offers = data.offers;
  }

  static createMapper(target) {
    return {
      day: (value) => {
        target.day = value;
      },
      travelway: (value) => {
        target.type[1] = value;
      },
      destination: (value) => {
        target.title = value;
      },
      time: (value) => {
        target.timeStart = value;
      },
      price: (value) => {
        target.price = value;
      },
      offer: (value) => {
        target.offers.push(value);
      }
    };
  }

  bind() {
    this._element.querySelector(`.point__button-save`)
      .addEventListener(`click`, this._onSubmitButtonClick);
    this._element.querySelector(`.point__button-delete`)
      .addEventListener(`click`, this._onDeleteButtonClick);
    document.addEventListener(`keydown`, this._onKeydownEsc);

    this._element.querySelector(`input[name="time"]`).flatpickr({
      mode: `range`,
      enableTime: true,
      noCalendar: true,
      altInput: false,
      dateFormat: `h:i`,
      defaultDate: [`00:00`, `12:00`]
    });
  }

  unbind() {
    this._element.querySelector(`.point__button-save`)
      .removeEventListener(`click`, this._onSubmitButtonClick);
    this._element.querySelector(`.point__button-delete`)
      .removeEventListener(`click`, this._onDeleteButtonClick);
    document.removeEventListener(`keydown`, this._onKeydownEsc);
  }

  _getOffers() {
    return this._offers.map((offer) => `<input class="point__offers-input visually-hidden" type="checkbox" id="${offer[0]}" name="offer" value="${offer[0]}">
    <label for="${offer[0]}" class="point__offers-label">
      <span class="point__offer-service">${offer[0]}</span> + €<span class="point__offer-price">${offer[1]}</span>
    </label>`).join(``);
  }

  _getPictures() {
    return this._picture.map((picture) =>
      `<img src="http:${picture}" alt="picture from place" class="point__destination-image">`).join(``);
  }

  get template() {
    return `<article class="point">
                <form action="" method="get" class="point__form">
                  <header class="point__header">
                    <label class="point__date">
                      choose day
                      <input class="point__input" type="text" placeholder="MAR 18" name="day">
                    </label>

                    <div class="travel-way">
                      <label class="travel-way__label" for="travel-way__toggle">${this._type[1]}</label>

                      <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

                      <div class="travel-way__select">
                        <div class="travel-way__select-group">
                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
                          <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
                          <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
                          <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train">
                          <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
                        </div>

                        <div class="travel-way__select-group">
                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
                          <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
                          <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                        </div>
                      </div>
                    </div>

                    <div class="point__destination-wrap">
                      <label class="point__destination-label" for="destination">${(this._type[0])}</label>
                      <input class="point__destination-input" list="destination-select" id="destination" value="${this._title}" name="destination">
                      <datalist id="destination-select">
                        <option value="airport"></option>
                        <option value="Geneva"></option>
                        <option value="Chamonix"></option>
                        <option value="hotel"></option>
                      </datalist>
                    </div>

                    <label class="point__time">
                      choose time
                      <input class="point__input" type="text" value="${this.getTime(this._timeStart)}" name="time" placeholder="00:00 — 00:00">
                    </label>

                    <label class="point__price">
                      write price
                      <span class="point__price-currency">€</span>
                      <input class="point__input" type="text" value="${this._price}" name="price">
                    </label>

                    <div class="point__buttons">
                      <button class="point__button point__button--save point__button-save" type="submit">Save</button>
                      <button class="point__button point__button-delete" type="reset">Delete</button>
                    </div>

                    <div class="paint__favorite-wrap">
                      <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
                      <label class="point__favorite" for="favorite">favorite</label>
                    </div>
                  </header>

                  <section class="point__details">
                    <section class="point__offers">
                      <h3 class="point__details-title">offers</h3>

                      <div class="point__offers-wrap">

                      </div>

                    </section>
                    <section class="point__destination">
                      <h3 class="point__details-title">Destination</h3>
                      <p class="point__destination-text">${this._description}</p>
                      <div class="point__destination-images">
                        ${this._getPictures()}
                      </div>
                    </section>
                    <input type="hidden" class="point__total-price" name="total-price" value="">
                  </section>
                </form>
              </article>`.trim();
  }
}
