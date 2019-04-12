import {EVENT_TYPES, POINT_DEFAULT} from '../utils/index';
import moment from 'moment';
import flatpickr from 'flatpickr';
import Component from './component.js';

export default class TripOpen extends Component {
  constructor(offers, destinations, data = POINT_DEFAULT) {
    super();
    this._id = data.id;
    this._referenceOffers = offers;
    this._referenceDestinations = destinations;

    this._state = {
      type: data.type,
      destination: data.destination,
      price: data.price,
      timeStart: data.timeStart,
      timeStop: data.timeStop,
      pictures: data.pictures,
      offers: data.offers,
      description: data.description,
      isFavorite: data.isFavorite,
    };

    this._onSubmit = null;
    this._onDelete = null;
    this._onKeyEsc = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onKeydownEsc = this._onKeydownEsc.bind(this);
    this._onTypeChange = this._onTypeChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onOffersChange = this._onOffersChange.bind(this);
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onKeyEsc(fn) {
    this._onKeyEsc = fn;
  }

  get template() {
    return `<article class="point">
                <form action="" method="get" class="point__form">
                  <header class="point__header">
                    <label class="point__date">
                      choose day
                      <input class="point__input" type="text" value="${this._getDay()}" name="day" readonly>
                    </label>

                    <div class="travel-way">
                      <label class="travel-way__label" for="travel-way__toggle">${EVENT_TYPES[this._state.type].icon}</label>

                      <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

                      <div class="travel-way__select">
                        <div class="travel-way__select-group" data-add="to">
                          ${TripOpen.getTravelWay(`to`)}
                        </div>
                        <div class="travel-way__select-group" data-add="in">
                          ${TripOpen.getTravelWay(`in`)}
                        </div>
                      </div>
                    </div>

                    <div class="point__destination-wrap">
                      <label class="point__destination-label" for="destination">${(this._state.type)} ${EVENT_TYPES[this._state.type].add}</label>
                      <input class="point__destination-input" list="destination-select" id="destination" value="${this._state.destination}" name="destination" required>
                      <datalist id="destination-select">
                        ${this._getDestination()}
                      </datalist>
                    </div>

                    <div class="point__time">
                      choose time
                      <input class="point__input" type="text" value="" name="date-start" placeholder="00:00">
                      <input class="point__input" type="text" value="" name="date-end" placeholder="00:00">
                    </div>

                    <label class="point__price">
                      write price
                      <span class="point__price-currency">€</span>
                      <input class="point__input" type="text" value="${this._state.price}" name="price">
                    </label>

                    <div class="point__buttons">
                      <button class="point__button point__button--save point__button-save" type="submit">Save</button>
                      <button class="point__button point__button-delete" type="reset">Delete</button>
                    </div>

                    <div class="paint__favorite-wrap">
                      <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._state.isFavorite ? `checked` : ``}>
                      <label class="point__favorite" for="favorite">favorite</label>
                    </div>
                  </header>

                  <section class="point__details">
                    <section class="point__offers">
                      <h3 class="point__details-destination">offers</h3>

                      <div class="point__offers-wrap">
                        ${this._getOffers()}
                      </div>

                    </section>
                    <section class="point__destination">
                      <h3 class="point__details-destination">Destination</h3>
                      <p class="point__destination-text">${this._state.description}</p>
                      <div class="point__destination-images">
                        ${this._getPictures()}
                      </div>
                    </section>
                    <input type="hidden" class="point__total-price" name="total-price" value="">
                  </section>
                </form>
              </article>`.trim();
  }

  _getOffers() {
    return this._state.offers.map((offer) => `<input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title}" name="offer" value="${offer.title}" ${(offer.accepted === true) ? `checked` : ``}>
    <label for="${offer.title}" class="point__offers-label">
      <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
    </label>`).join(``);
  }

  _getPictures() {
    return this._state.pictures.map((picture) =>
      `<img src="${picture.src}" alt="picture from place" class="point__destination-image">`).join(``);
  }

  _getDestination() {
    const arrResult = [];
    this._referenceDestinations.map((item) => arrResult.push(item.name));
    return arrResult.map((item) => `<option value="${item}"></option>`).join(``);
  }

  _getDay() {
    return moment(this._state.timeStart).format(`MMM YY`);
  }

  _partialUpdate() {
    this.unbind();
    const oldElement = this._element;
    this.render();
    oldElement.parentNode.replaceChild(this._element, oldElement);
  }

  blockToDelete() {
    const btnDelete = this._element.querySelector(`.point__button-delete`);
    btnDelete.disabled = true;
    btnDelete.textContent = `Deleting...`;
    this._element.querySelector(`.point__button-save`).disabled = true;
  }

  unblockToDelete() {
    const btnDelete = this._element.querySelector(`.point__button-delete`);
    btnDelete.disabled = false;
    btnDelete.textContent = `Delete`;
    this._element.querySelector(`.point__button-save`).disabled = false;
  }

  blockToSave() {
    const btnSave = this._element.querySelector(`.point__button-save`);
    btnSave.disabled = true;
    btnSave.textContent = `Saving...`;
    this._element.querySelector(`.point__button-delete`).disabled = true;
  }

  unblockToSave() {
    const btnSave = this._element.querySelector(`.point__button-save`);
    btnSave.disabled = false;
    btnSave.textContent = `Save`;
    this._element.querySelector(`.point__button-delete`).disabled = false;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(this._state);
    }
  }

  _onDeleteButtonClick() {
    return (typeof this._onDelete === `function`) && this._onDelete({id: this._id});
  }

  _onKeydownEsc(evt) {
    return (typeof this._onKeyEsc === `function`) && (evt.keyCode === 27) && this._onKeyEsc();
  }

  _onTypeChange({target}) {
    const oldPrice = target.parentNode.parentNode.parentNode.parentNode.querySelector(`input[name="price"]`);
    oldPrice.style.color = `red`;
    if (target.classList[0] === `travel-way__select-label`) {
      this._state.type = target.previousElementSibling.value;
      this._state.offers = [];
      const type = this._referenceOffers.filter((item) => item.type === this._state.type);
      if (type.length !== 0) {
        const arrOffers = type[0].offers;
        for (const refOffer of arrOffers) {
          this._state.offers.push({title: refOffer.name, price: refOffer.price, accepted: false});
        }
      }
    }
    this._partialUpdate();
  }

  _onDestinationChange({target}) {
    this._state.destination = target.value;
    const name = this._referenceDestinations.filter((item) => item.name === this._state.destination);
    if (name.length !== 0) {
      this._state.description = name[0].description;
      this._state.pictures = name[0].pictures;
    } else {
      this._state.description = ``;
      this._state.pictures = [];
    }
    this._partialUpdate();
  }

  _onPriceChange({target}) {
    this._state.price = target.value;
  }

  _onOffersChange({target}) {
    for (const offer of this._state.offers) {
      if (offer.title === target.value) {
        offer.accepted = target.checked;
        break;
      }
    }
  }

  _onFavoriteChange({target}) {
    this._state.isFavorite = target.checked;
  }

  bind() {
    this._element.querySelector(`.point__button-save`)
      .addEventListener(`click`, this._onSubmitButtonClick);
    this._element.querySelector(`.point__button-delete`)
      .addEventListener(`click`, this._onDeleteButtonClick);
    document.addEventListener(`keydown`, this._onKeydownEsc);

    this._element.querySelector(`.travel-way__select`)
      .addEventListener(`click`, this._onTypeChange);
    this._element.querySelector(`input[name="destination"]`)
      .addEventListener(`change`, this._onDestinationChange);
    this._element.querySelector(`input[name="price"]`)
      .addEventListener(`change`, this._onPriceChange);
    this._element.querySelector(`input[name="favorite"]`)
      .addEventListener(`change`, this._onFavoriteChange);

    const offers = this._element.querySelectorAll(`.point__offers-input`);
    [].forEach.call(offers, (element) => {
      element.addEventListener(`click`, this._onOffersChange);
    });

    const dateStart = flatpickr(this._element.querySelector(`input[name="date-start"]`), {
      [`time_24hr`]: true,
      enableTime: true,
      altInput: true,
      dateFormat: `Z`,
      altFormat: `H:i`,
      defaultDate: moment(this._state.timeStart).format(),
      onClose: (dateStr) => {
        this._state.timeStart = Date.parse(dateStr);
      },
      onChange: (selectedDates) => {
        dateEnd.set(`minDate`, selectedDates[0]);
      }
    });

    const dateEnd = flatpickr(this._element.querySelector(`input[name="date-end"]`), {
      [`time_24hr`]: true,
      enableTime: true,
      altInput: true,
      dateFormat: `Z`,
      altFormat: `H:i`,
      defaultDate: moment(this._state.timeStop).format(),
      onClose: (dateStr) => {
        this._state.timeStop = Date.parse(dateStr);
      },
      onChange: (selectedDates) => {
        dateStart.set(`maxDate`, selectedDates[0]);
      }
    });
  }

  unbind() {
    this._element.querySelector(`.point__button-save`)
      .removeEventListener(`click`, this._onSubmitButtonClick);
    this._element.querySelector(`.point__button-delete`)
      .removeEventListener(`click`, this._onDeleteButtonClick);
    document.removeEventListener(`keydown`, this._onKeydownEsc);

    this._element.querySelector(`.travel-way__select`)
      .removeEventListener(`click`, this._onTypeChange);
    this._element.querySelector(`input[name="destination"]`)
      .removeEventListener(`change`, this._onDestinationChange);
    this._element.querySelector(`input[name="price"]`)
      .removeEventListener(`change`, this._onPriceChange);
    this._element.querySelector(`input[name="favorite"]`)
      .removeEventListener(`change`, this._onFavoriteChange);

    const offers = this._element.querySelectorAll(`.point__offers-input`);
    [].forEach.call(offers, (element) => {
      element.removeEventListener(`click`, this._onOffersChange);
    });

    flatpickr(this._element.querySelector(`input[name="date-start"]`)).destroy();
    flatpickr(this._element.querySelector(`input[name="date-end"]`)).destroy();
  }

  static getTravelWay(typeTravel) {
    const arrResult = [];
    for (let key in EVENT_TYPES) {
      if (EVENT_TYPES[key].add === typeTravel) {
        arrResult.push({type: key, icon: EVENT_TYPES[key].icon});
      }
    }
    return arrResult.map((item) =>
      `<input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${item.type}" name="travel-way" value="${item.type}">
      <label class="travel-way__select-label" for="travel-way-${item.type}">${item.icon} ${item.type}</label>`).join(``);
  }
}
