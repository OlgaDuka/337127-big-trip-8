import {getRandomInRange, EVENT_TYPES, CITY_NAMES, OFFER_NAMES, DESTINATIONS, Price} from './utils/index.js';

const DEF_MIN_OFFERS = 0;
const DEF_MIN_DESTINATIONS = 1;
const DEF_MAX_OFFERS = 2;
const DEF_MAX_DESTINATIONS = 3;
const TIME = 86400000;
const DAY = 7;
const TIME_START = 0;
const TIME_STOP = 60000000;

const setValue = (min, max, set) => {
  const num = getRandomInRange(min, max);
  const arrResult = [];
  const arrNumber = new Array(num);
  if (num > 0) {
    let i = 0;
    while (i < num) {
      let number = getRandomInRange(0, set.size);
      if (arrNumber.indexOf(number) === -1) {
        arrResult[i] = [...set][number];
        arrNumber[i] = number;
        i += 1;
      }
    }
  }
  return arrResult;
};

export const eventTrip = () => {
  return {
    type: EVENT_TYPES[0][Math.floor(Math.random() * EVENT_TYPES[0].length)],
    title: CITY_NAMES[Math.floor(Math.random() * CITY_NAMES.length)],
    day: new Date(Date.now() + Math.floor(Math.random() * DAY) * TIME),
    timeStart: Date.now() + Math.floor(Math.random() * DAY) * TIME,
    timeStop: Date.now() + Math.floor(Math.random() * DAY) * TIME + getRandomInRange(TIME_START, TIME_STOP),
    picture: `//picsum.photos/100/100?r=${Math.random()}`,
    offers: setValue(DEF_MIN_OFFERS, DEF_MAX_OFFERS, OFFER_NAMES),
    destinations: setValue(DEF_MIN_DESTINATIONS, DEF_MAX_DESTINATIONS, DESTINATIONS),
    isFavorite: Boolean(Math.round(Math.random())),
    isCollapse: true
  };
};
