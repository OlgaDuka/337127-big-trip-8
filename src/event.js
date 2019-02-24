import {getRandomInRange} from './main.js';

export const boardEvents = document.querySelector(`.trip-day__items`);
const Num = {
  MIN_PRICE_EVENT: 20,
  MAX_PRICE_EVENT: 100,
  MIN_PRICE_SERVICE: 10,
  MAX_PRICE_SERVICE: 200
};

const getHtmlEvent = () => {
  return `<article class="trip-point">
            <i class="trip-icon">🚕</i>
            <h3 class="trip-point__title">Taxi to Airport</h3>
            <p class="trip-point__schedule">
              <span class="trip-point__timetable">10:00&nbsp;&mdash; 11:00</span>
              <span class="trip-point__duration">1h 30m</span>
            </p>
            <p class="trip-point__price">&euro;&nbsp;${getRandomInRange(Num.MIN_PRICE_EVENT, Num.MAX_PRICE_EVENT)}</p>
            <ul class="trip-point__offers">
              <li>
                <button class="trip-point__offer">Order UBER +&euro;&nbsp;${getRandomInRange(Num.MIN_PRICE_SERVICE, Num.MAX_PRICE_SERVICE)}</button>
              </li>
              <li>
                <button class="trip-point__offer">Upgrade to business +&euro;&nbsp;${getRandomInRange(Num.MIN_PRICE_SERVICE, Num.MAX_PRICE_SERVICE)}</button>
              </li>
            </ul>
          </article>`;
};

export const renderEvents = (num) => {
  for (let i = 0; i < num; i += 1) {
    boardEvents.insertAdjacentHTML(`beforeend`, getHtmlEvent());
  }
};
