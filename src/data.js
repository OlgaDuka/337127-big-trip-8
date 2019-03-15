import {getRandomInRange,
  getRandomBoolean,
  getRandomIndexArr,
  getRandomDate,
  getArrFromSet,
  getRandomPhoto,
  getRandomNamePoint,
  EVENT_TYPES, OFFER_NAMES, DESCRIPTIONS} from './utils/index.js';

const DEF_MIN_OFFERS = 2;
const DEF_MIN_DESCRIPTIONS = 1;
const DEF_MAX_OFFERS = 5;
const DEF_MAX_DESCRIPTIONS = 3;
const DEF_MIN_PHOTO = 3;
const DEF_MAX_PHOTO = 8;
const DAY = 7;
const TIME_START = 0;
const TIME_STOP = 43200000; // кол-во милисекунд в половине суток
const Price = {
  MIN_PRICE_EVENT: 100,
  MAX_PRICE_EVENT: 300,
};

export const eventTrip = () => {
  const time = getRandomDate(DAY);
  const typePoint = getRandomIndexArr(EVENT_TYPES[0]);
  return {
    type: typePoint,
    title: getRandomNamePoint(),
    price: getRandomInRange(Price.MIN_PRICE_EVENT, Price.MAX_PRICE_EVENT),
    day: new Date(time),
    timeStart: time,
    timeStop: time + getRandomInRange(TIME_START, TIME_STOP),
    picture: getRandomPhoto(getRandomInRange(DEF_MIN_PHOTO, DEF_MAX_PHOTO)),
    offers: getArrFromSet(OFFER_NAMES, DEF_MIN_OFFERS, DEF_MAX_OFFERS),
    description: getArrFromSet(DESCRIPTIONS, DEF_MIN_DESCRIPTIONS, DEF_MAX_DESCRIPTIONS),
    isFavorite: getRandomBoolean(),
    isCollapse: true
  };
};
