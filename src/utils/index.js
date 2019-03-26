import * as cnt from '../constants';
import moment from 'moment';

export const EVENT_TYPES = [
  [`Taxi`, `🚕`, `to`],
  [`Bus`, `🚌`, `to`],
  [`Train`, `🚂`, `to`],
  [`Ship`, `🛳️`, `to`],
  [`Transport`, `🚊`, `to`],
  [`Drive`, `🚗`, `to`],
  [`Flight`, `✈️`, `to`],
  [`Check`, `🏨`, `in`],
  [`Sightseeing`, `🏛️`, `in`],
  [`Restaurant`, `🍴`, `in`]
];

export const OFFER_NAMES = new Set([
  [`Add luggage`, `0`, false, `in`],
  [`Switch to comfort class`, `0`, false, `to`],
  [`Add meal`, `0`, false, `all`],
  [`Choose seats`, `0`, false, `to`],
  [`Get of calling cards`, `0`, false, `in`],
  [`Add insurance`, `0`, false, `all`],
  [`Booking ticket for event`, `0`, false, `in`],
  [`Booking cars`, `0`, false, `in`]
]);

export const DESCRIPTIONS = new Set([
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
]);

export const StatData = [{selector: `.statistic__money`, title: `MONEY`, unit: `€`, method: `getPointsMoney`},
  {selector: `.statistic__transport`, title: `TRANSPORT`, unit: `x`, method: `getPointsTransport`},
  {selector: `.statistic__time-spend`, title: `TIME-SPEND`, unit: `H`, method: `getPointsTimeSpend`}];

export const CITY_NAMES = [`Singapore`, `Kuala-Lumpur`, `Manila`, `Karachi`, `Kolombo`, `Muli`, `Lima`, `Hong Kong`, `Macau`, `Dubai`, `Kathmandu`];

export const NAME_FILTERS = [`everything`, `future`, `past`];

export const getTimeStr = (time1, time2) => {
  moment.locale(`en-gb`);
  const str1 = moment(time1).format(`LT`);
  const str2 = moment(time2).format(`LT`);
  return `${str1} — ${str2}`;
};

export const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const getRandomBoolean = () => Boolean(Math.round(Math.random()));
export const getRandomIndexArr = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const getRandomDate = (day) => Date.now() + Math.floor(Math.random() * day) * cnt.TIME;

export const getRandomNamePoint = () => {
  const arrName = document.querySelector(`.trip__points`).textContent.split(`— `);
  const maxIndex = arrName.length - 1;
  return arrName[getRandomInRange(0, maxIndex)];
};

export const getRandomPhoto = (amount) => {
  let result = new Array(amount);
  for (let i = 0; i < amount; i += 1) {
    result[i] = `//picsum.photos/300/150?r=${Math.random()}`;
  }
  return result;
};

export const getArrFromSet = (originalSet, min, max) => {
  const arrResult = [];
  const arrNumber = [];
  let i = 0;
  const j = getRandomInRange(min, max);
  if (j > 0) {
    while (i < j) {
      let num = getRandomInRange(0, originalSet.size - 1);
      if (arrNumber.indexOf(num) === -1) {
        arrResult[i] = [...originalSet][num];
        arrNumber[i] = num;
        i += 1;
      }
    }
  }
  return arrResult;
};

export const getOffersFromSet = (originalSet, type) => {
  const arrResult = [];
  const arrNumber = [];
  let flagChoice = 0;
  for (let i = 0; i < originalSet.size - 1; i += 1) {
    let num = getRandomInRange(0, originalSet.size - 1);
    let arrTemp = [...originalSet][num];
    if ((arrNumber.indexOf(num) === -1) && ((arrTemp[3] === type) || (arrTemp[3] === `all`))) {
      arrTemp[1] = `${getRandomInRange(cnt.MIN_PRICE_OFFER, cnt.MAX_PRICE_OFFER)}`;
      if (flagChoice < 2) {
        arrTemp[2] = true;
        flagChoice += 1;
      }
      arrResult.push(arrTemp);
      arrNumber.push(num);
    }
  }
  return arrResult;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const createFilter = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement;
};

export const createEvent = () => {
  const time1 = getRandomDate(cnt.DAY);
  const time2 = time1 + getRandomInRange(cnt.TIME_START, cnt.TIME_STOP);
  const typePoint = getRandomIndexArr(EVENT_TYPES);
  return {
    type: typePoint,
    title: getRandomNamePoint(),
    price: getRandomInRange(cnt.Price.MIN_PRICE_EVENT, cnt.Price.MAX_PRICE_EVENT),
    day: new Date(time1),
    timeStart: time1,
    timeStop: time2,
    time: getTimeStr(time1, time2),
    picture: getRandomPhoto(getRandomInRange(cnt.DEF_MIN_PHOTO, cnt.DEF_MAX_PHOTO)),
    offers: getOffersFromSet(OFFER_NAMES, typePoint[2]),
    description: getArrFromSet(DESCRIPTIONS, cnt.DEF_MIN_DESCRIPTIONS, cnt.DEF_MAX_DESCRIPTIONS, ``),
    isFavorite: getRandomBoolean(),
    isDeleted: false
  };
};
