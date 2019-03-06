import {Price, getRandomInRange} from './utils/index.js';
import {eventTrip} from './data.js';

export const boardEvents = document.querySelector(`.trip-day__items`);

const getDuration = (timeStop, timeStart) => {
  let stroke = new Date(timeStop - timeStart);
  let hours = `${stroke.toLocaleString(`en-US`, {hour: `2-digit`})}H `;
  let minutes = `${stroke.toLocaleString(`en-US`, {minute: `2-digit`})}M`;
  return hours + minutes;
};

const getOffer = (ob) => {
  return ob.offers.map((offer) => `<li>
      <button class="trip-point__offer">${offer} +&euro;&nbsp;${getRandomInRange(Price.MIN_PRICE_OFFER, Price.MAX_PRICE_OFFER)}</button>
    </li>`);
};

export const createEvent = (obEvent) => `<article class="trip-point">
            <i class="trip-icon">${obEvent.type[1]}</i>
            <h3 class="trip-point__title">${obEvent.type[0]}</h3>
            <p class="trip-point__schedule">
              <span class="trip-point__timetable">${new Date(obEvent.timeStart).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`})}&nbsp;&mdash; ${new Date(obEvent.timeStop).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`})}</span>
              <span class="trip-point__duration">${getDuration(obEvent.timeStop, obEvent.timeStart)}</span>
            </p>
            <p class="trip-point__price">&euro;&nbsp;${getRandomInRange(Price.MIN_PRICE_EVENT, Price.MAX_PRICE_EVENT)}</p>
            <ul class="trip-point__offers">
              ${getOffer(obEvent)}
            </ul>
          </article>`;

export const renderEvents = (num) => {
  for (let i = 0; i < num; i += 1) {
    boardEvents.insertAdjacentHTML(`beforeend`, createEvent(eventTrip()));
  }
};
