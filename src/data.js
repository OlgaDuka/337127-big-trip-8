import * as util from './utils/index';

const DEF_MIN_DESCRIPTIONS = 1;
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
  const time1 = util.getRandomDate(DAY);
  const time2 = time1 + util.getRandomInRange(TIME_START, TIME_STOP);
  const typePoint = util.getRandomIndexArr(util.EVENT_TYPES[0]);
  return {
    type: typePoint,
    title: util.getRandomNamePoint(),
    price: util.getRandomInRange(Price.MIN_PRICE_EVENT, Price.MAX_PRICE_EVENT),
    day: new Date(time1),
    timeStart: time1,
    timeStop: time2,
    time: util.getTimeStr(time1, time2),
    picture: util.getRandomPhoto(util.getRandomInRange(DEF_MIN_PHOTO, DEF_MAX_PHOTO)),
    offers: util.getOffersFromSet(util.OFFER_NAMES, typePoint[2]),
    description: util.getArrFromSet(util.DESCRIPTIONS, DEF_MIN_DESCRIPTIONS, DEF_MAX_DESCRIPTIONS, ``),
    isFavorite: util.getRandomBoolean(),
    isCollapse: true
  };
};

// export const arrTripEvents = (amount) => {
//  const array = new Array(amount);
//  for (let i = 0; i < amount; i += 1) {
//    array[i] = eventTrip();
//  }
//  return array;
// };

export const arrTripEvents = new Array(util.NumConst.START_EVENTS)
  .fill(``)
  .map(() => eventTrip());
