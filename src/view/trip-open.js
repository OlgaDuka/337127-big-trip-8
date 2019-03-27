import {EVENT_TYPES} from '../utils/index';
import moment from 'moment';
import flatpickr from 'flatpickr';
import Component from './component.js';

export default class TripOpen extends Component {
  constructor(data) {
    super();
    this._id = data.id;
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
    this._isDeleted = data.isDeleted;

    this._state = {
      id: data.id,
      type: data.type,
      title: data.title,
      price: data.price,
      day: data.day,
      timeStart: data.timeStart,
      timeStop: data.timeStop,
      picture: data.picture,
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

  _partialUpdate() {
    this.unbind();
    const oldElement = this._element;
    this.render();
    oldElement.parentNode.replaceChild(this._element, oldElement);
  }

  update(dataFromState) {
    this._type = dataFromState.type;
    this._title = dataFromState.title;
    this._price = dataFromState.price;
    this._day = dataFromState.day;
    this._timeStart = dataFromState.timeStart;
    this._timeStop = dataFromState.timeStop;
    this._offers = dataFromState.offers;
    this._description = dataFromState.description;
    this._picture = dataFromState.picture;
  }

  _onTypeChange({target}) {
    if (target.classList[0] === `travel-way__select-label`) {
      let typeName = target.previousElementSibling.value;
      let typeIcon = target.textContent;
      let typeAdd = target.parentElement.dataset[`add`];
      typeName = typeName[0].toUpperCase() + typeName.slice(1) + ` ` + typeAdd;
      typeIcon = typeIcon.split(` `, 1);
      this._type[0] = typeName;
      this._type[1] = typeIcon;
      this._state.type = this._type;
    }
    this._partialUpdate();
  }

  _onDestinationChange({target}) {
    this._state.title = target.value;
  }

  _onPriceChange({target}) {
    this._state.price = target.value;
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

  _onOffersChange({target}) {
    const price = target.nextElementSibling.querySelector(`.point__offer-price`).textContent;
    const str = target.value;
    if (target.checked) {
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
    const offersTotalPrice = this._offers.filter((offer) => offer[2] === true).reduce((acc, offer) => acc + parseInt(offer[1], 10), 0);
    return +this._price + offersTotalPrice;
  }

  updatePrice() {
    this._element.querySelector(`.point__input[name="price"]`).value = this.price;
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

  _getTravelWay(typeTravel) {
    const arrResult = [];
    EVENT_TYPES.forEach((elem) => {
      if (elem[2] === typeTravel) {
        arrResult.push(elem);
      }
    });
    return arrResult.map((type) =>
      `<input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-${type[0].toLowerCase()}" name="travel-way" value="${type[0].toLowerCase()}">
      <label class="travel-way__select-label" for="travel-way-${type[0].toLowerCase()}">${type[1]} ${type[0].toLowerCase()}</label>`).join(``);
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
                          ${this._getTravelWay(`to`)}
                        </div>
                        <div class="travel-way__select-group" data-add="in">
                          ${this._getTravelWay(`in`)}
                        </div>
                      </div>
                    </div>

                    <div class="point__destination-wrap">
                      <label class="point__destination-label" for="destination">${(this._type[0])} ${(this._type[2])}</label>
                      <input class="point__destination-input" list="destination-select" id="destination" value="${this._title}" name="destination">
                      <datalist id="destination-select">
                        <option value="airport"></option>
                        <option value="Geneva"></option>
                        <option value="Chamonix"></option>
                        <option value="hotel"></option>
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
