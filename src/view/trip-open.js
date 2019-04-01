import {EVENT_TYPES} from '../utils/index';
import moment from 'moment';
import flatpickr from 'flatpickr';
import Component from './component.js';

export default class TripOpen extends Component {
  constructor(data, offers, destinations) {
    super();
    this._id = data.id;
    this._type = data.type;
    this._destination = data.destination;
    this._price = data.price;
    this._day = data.day;
    this._timeStart = data.timeStart;
    this._timeStop = data.timeStop;
    this._pictures = data.pictures;
    this._offers = data.offers;
    this._description = data.description;
    this._isFavorite = data.isFavorite;
    this._referenceOffers = offers;
    this._referenceDestinations = destinations;

    this._state = {
      id: data.id,
      type: data.type,
      destination: data.destination,
      price: data.price,
      day: data.day,
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
    this._onOffersChange = this._onOffersChange.bind(this);
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
    return (typeof this._onDelete === `function`) && this._onDelete({id: this._id});
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

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }


  _partialUpdate() {
    this.unbind();
    const oldElement = this._element;
    this.render();
    oldElement.parentNode.replaceChild(this._element, oldElement);
  }

  update(dataFromState) {
    this._type = dataFromState.type;
    this._destination = dataFromState.destination;
    this._price = dataFromState.price;
    this._day = dataFromState.day;
    this._timeStart = dataFromState.timeStart;
    this._timeStop = dataFromState.timeStop;
    this._offers = dataFromState.offers;
    this._description = dataFromState.description;
    this._pictures = dataFromState.pictures;
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

  _onTypeChange({target}) {
    if (target.classList[0] === `travel-way__select-label`) {
      this._state.type = target.previousElementSibling.value;
      this._type = this._state.type;
      this._offers = [];
      const type = this._referenceOffers.filter((item) => item.type === this._type);
      if (type.length !== 0) {
        const arrOffers = type[0].offers;
        for (const refOffer of arrOffers) {
          this._offers.push({title: refOffer.name, price: refOffer.price, accepted: false});
        }
      }
      this._state.offers = this._offers;
    }
    this._partialUpdate();
  }

  _onDestinationChange({target}) {
    this._state.destination = target.value;
    this._destination = this._state.destination;
    const name = this._referenceDestinations.filter((item) => item.name === this._destination);
    if (name.length !== 0) {
      this._state.description = name[0].description;
      this._state.pictures = name[0].pictures;
      this._description = this._state.description;
      this._pictures = this._state.pictures;
    } else {
      this._state.description = ``;
      this._state.pictures = [];
      this._description = ``;
      this._pictures = [];

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
        // тут будет функция пересчета общей стоимости путешествия
        break;
      }
    }
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
      defaultDate: moment(this._timeStart).format(),
      onClose: (dateStr) => {
        this._timeStart = Date.parse(dateStr);
        this._state.timeStart = this._timeStart;
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
      defaultDate: moment(this._timeStop).format(),
      onClose: (dateStr) => {
        this._timeStop = Date.parse(dateStr);
        this._state.timeStop = this._timeStop;
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

    const offers = this._element.querySelectorAll(`.point__offers-input`);
    [].forEach.call(offers, (element) => {
      element.removeEventListener(`click`, this._onOffersChange);
    });

    flatpickr(this._element.querySelector(`input[name="date-start"]`)).destroy();
    flatpickr(this._element.querySelector(`input[name="date-end"]`)).destroy();
  }

  get price() {
    const offersTotalPrice = this._offers.filter((offer) => offer.accepted === true).reduce((acc, offer) => acc + parseInt(offer.price, 10), 0);
    return +this._price + offersTotalPrice;
  }

  updatePrice() {
    this._element.querySelector(`.point__input[name="price"]`).value = this.price;
  }

  _getOffers() {
    return this._offers.map((offer) => `<input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title}" name="offer" value="${offer.title}" ${(offer.accepted === true) ? `checked` : ``}>
    <label for="${offer.title}" class="point__offers-label">
      <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
    </label>`).join(``);
  }

  _getPictures() {
    return this._pictures.map((picture) =>
      `<img src="${picture.src}" alt="picture from place" class="point__destination-image">`).join(``);
  }

  _getTravelWay(typeTravel) {
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

  _getDestination() {
    const arrResult = [];
    this._referenceDestinations.map((item) => arrResult.push(item.name));
    return arrResult.map((item) => `<option value="${item}"></option>`).join(``);
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
                      <label class="travel-way__label" for="travel-way__toggle">${EVENT_TYPES[this._type].icon}</label>

                      <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

                      <div class="travel-way__select">
                        <div class="travel-way__select-group" data-add="to">
                          ${this._getTravelWay(`to`)}
                        </div>
                        <div class="travel-way__select-group" data-add="in">
                          ${this._getTravelWay(`in`)}
                        </div>
                      </div>
                    </div>

                    <div class="point__destination-wrap">
                      <label class="point__destination-label" for="destination">${(this._type)} ${EVENT_TYPES[this._type].add}</label>
                      <input class="point__destination-input" list="destination-select" id="destination" value="${this._destination}" name="destination">
                      <datalist id="destination-select">
                        ${this._getDestination()}
                      </datalist>
                    </div>

                    <div class="point__time">
                      choose time
                      <input class="point__input" type="text" value="" name="date-start" placeholder="19:00">
                      <input class="point__input" type="text" value="" name="date-end" placeholder="21:00">
                    </div>

                    <label class="point__price">
                      write price
                      <span class="point__price-currency">€</span>
                      <input class="point__input" type="text" value="${this.price}" name="price">
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
                      <h3 class="point__details-destination">offers</h3>

                      <div class="point__offers-wrap">
                        ${this._getOffers()}
                      </div>

                    </section>
                    <section class="point__destination">
                      <h3 class="point__details-destination">Destination</h3>
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
