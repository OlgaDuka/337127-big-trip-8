import {Price, getRandomInRange} from './utils/index.js';

const getDuration = (timeStop, timeStart) => {
  let stroka = new Date(timeStop - timeStart).toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`});
  let hour = ``;
  let minute = ``;
  if (stroka.length === 8) {
    hour = stroka.substr(0, 2);
    minute = stroka.substr(3, 2);
  } else {
    hour = stroka.substr(0, 1);
    minute = stroka.substr(2, 2);
  }
  stroka = hour + `H ` + minute + `M`;
  return stroka;
};

const getOffer = (ob) => {
  let htmlOffer = ``;
  for (let offer of ob.offers) {
    htmlOffer += `<li>
                      <button class="trip-point__offer">${offer} +&euro;&nbsp;${getRandomInRange(Price.MIN_PRICE_OFFER, Price.MAX_PRICE_OFFER)}</button>
                  </li>`;
  }
  return htmlOffer;
};

export const createEvent = (obEvent) => {
  return `<article class="trip-point">
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
};
