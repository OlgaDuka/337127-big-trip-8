import moment from 'moment';
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
    this._time = data.time;
    this._picture = data.picture;
    this._offers = data.offers;
    this._description = data.description;
    this._isFavorite = data.isFavorite;
    this._isCollapse = data.isCollapse;

    this._state = {
      type: data.type,
      title: data.title,
      price: data.price,
      day: data.day,
      timeStart: data.timeStart,
      timeStop: data.timeStop,
      time: data.time,
      picture: data.picture,
      offers: data.offers,
      description: data.description,
      isFavorite: data.isFavorite,
      isCollapse: data.isCollapse
    };

    this._onSubmit = null;
    this._onDelete = null;
    this._onKeyEsc = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onKeydownEsc = this._onKeydownEsc.bind(this);
    this._onCloseFlatpickr = this._onCloseFlatpickr.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onChangePrice = this._onChangePrice.bind(this);
    this._onChangeOffers = this._onChangeOffers.bind(this);
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(this._state);
    }
    this.update(this._state);
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
    this.unbind();
    const oldElement = this._element;
    this.render();
    oldElement.parentNode.replaceChild(this._element, oldElement);
  }

  update(data) {
    this._title = data.title;
    this._price = data.price;
    this._day = data.day;
    this._time = data.time;
    this._offers = data.offers;
  }

  _onCloseFlatpickr(selectedDates, dateStr) {
    this._timeStart = moment(selectedDates[0]).format(`LT`);
    this._timeStop = moment(selectedDates[1]).format(`LT`);
    this._time = dateStr.replace(`to`, `—`);
    this._state.timeStart = this._timeStart;
    this._state.timeStop = this._timeStop;
    this._state.time = this._time;
  }

  _onChangeType(evt) {
    if (evt.target.classList[0] === `travel-way__select-label`) {
      let typeName = evt.target.previousElementSibling.value;
      let typeIcon = evt.target.textContent;
      let typeAdd = evt.target.parentElement.dataset[`add`];
      typeName = typeName[0].toUpperCase() + typeName.slice(1) + ` ` + typeAdd;
      typeIcon = typeIcon.split(` `, 1);
      this._type[0] = typeName;
      this._type[1] = typeIcon;
      this._state.type = this._type;
    }
    this._partialUpdate();
  }

  _onChangeDestination(evt) {
    this._state.title = evt.target.value;
  }

  _onChangePrice(evt) {
    this._state.price = evt.target.value;
  }

  _replaceOffer(strFind, strPrice, flagOffer) {
    let num = -1;
    for (let i = 0; i < this._state.offers.length; i += 1) {
      if (this._state.offers[i][0] === strFind) {
        num = i;
        break;
      }
    }
    if (num !== -1) {
      this._state.offers.splice(num, 1, [strFind, strPrice, flagOffer]);
    }
  }

  _onChangeOffers(evt) {
    const price = evt.target.nextElementSibling.querySelector(`.point__offer-price`).textContent;
    const str = evt.target.value;
    if (evt.target.checked) {
      this._replaceOffer(str, price, true);
    } else {
      this._replaceOffer(str, price, false);
    }
  }

  bind() {
    this._element.querySelector(`.point__button-save`)
      .addEventListener(`click`, this._onSubmitButtonClick);
    this._element.querySelector(`.point__button-delete`)
      .addEventListener(`click`, this._onDeleteButtonClick);
    document.addEventListener(`keydown`, this._onKeydownEsc);

    this._element.querySelector(`.travel-way__select`)
      .addEventListener(`click`, this._onChangeType);
    this._element.querySelector(`input[name="destination"]`)
      .addEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`input[name="price"]`)
      .addEventListener(`change`, this._onChangePrice);

    const offers = this._element.querySelectorAll(`.point__offers-input`);
    [].forEach.call(offers, (element) => {
      element.addEventListener(`click`, this._onChangeOffers);
    });

    flatpickr(this._element.querySelector(`input[name="time"]`), {
      mode: `range`,
      time_24hr: true,
      minDate: "today",
      defaultDate: [this._timeStart, this._timeStop],
      enableTime: true,
      dateFormat: `H:i`,
      onClose: this._onCloseFlatpickr
    });
  }

  unbind() {
    this._element.querySelector(`.point__button-save`)
      .removeEventListener(`click`, this._onSubmitButtonClick);
    this._element.querySelector(`.point__button-delete`)
      .removeEventListener(`click`, this._onDeleteButtonClick);
    document.removeEventListener(`keydown`, this._onKeydownEsc);

    this._element.querySelector(`.travel-way__select`)
      .removeEventListener(`click`, this._onChangeType);
    this._element.querySelector(`input[name="destination"]`)
      .removeEventListener(`change`, this._onChangeDestination);
    this._element.querySelector(`input[name="price"]`)
      .removeEventListener(`change`, this._onChangePrice);

    const offers = this._element.querySelectorAll(`.point__offers-input`);
    [].forEach.call(offers, (element) => {
      element.removeEventListener(`click`, this._onChangeOffers);
    });
  }

  _getOffers() {
    return this._offers.map((offer) => `<input class="point__offers-input visually-hidden" type="checkbox" id="${offer[0]}" name="offer" value="${offer[0]}" ${(offer[2] === true) ? `checked` : ``}>
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
                        <div class="travel-way__select-group" data-add="to">
                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
                          <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
                          <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
                          <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

                          <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="flight">
                          <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
                        </div>

                        <div class="travel-way__select-group" data-add="in">
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
                      <input class="point__input" type="text"
                      value="${this._time}"
                      name="time" placeholder="00:00 — 00:00">
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
                        ${this._getOffers()}
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
