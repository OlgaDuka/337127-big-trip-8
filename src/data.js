import {getRandomInRange,
  getRandomBoolean,
  getRandomIndexArr,
  getRandomDate,
  getArrFromSet,
  getRandomPhoto,
  EVENT_TYPES, CITY_NAMES, OFFER_NAMES, DESTINATIONS} from './utils/index.js';

const DEF_MIN_OFFERS = 2;
const DEF_MIN_DESTINATIONS = 1;
const DEF_MAX_OFFERS = 5;
const DEF_MAX_DESTINATIONS = 3;
const DEF_MIN_PHOTO = 3;
const DEF_MAX_PHOTO = 8;
const DAY = 7;
const TIME_START = 0;
const TIME_STOP = 43200000; // кол-во милисекунд в половине суток


export const eventTrip = () => {
  const time = getRandomDate(DAY);
  return {
    type: getRandomIndexArr(EVENT_TYPES[0]),
    title: getRandomIndexArr(CITY_NAMES),
    day: new Date(time),
    timeStart: time,
    timeStop: time + getRandomInRange(TIME_START, TIME_STOP),
    picture: getRandomPhoto(getRandomInRange(DEF_MIN_PHOTO, DEF_MAX_PHOTO)),
    offers: getArrFromSet(OFFER_NAMES, DEF_MIN_OFFERS, DEF_MAX_OFFERS),
    destinations: getArrFromSet(DESTINATIONS, DEF_MIN_DESTINATIONS, DEF_MAX_DESTINATIONS),
    isFavorite: getRandomBoolean(),
    isCollapse: true
  };
};
