export const POINT_DEFAULT = {
  id: null,
  type: `taxi`,
  destination: [],
  price: 0,
  timeStart: new Date(),
  timeStop: new Date(),
  pictures: [],
  offers: [],
  description: ``,
  isFavorite: false,
};

export const EVENT_TYPES = {
  'taxi': {icon: `🚕`, add: `to`},
  'bus': {icon: `🚌`, add: `to`},
  'train': {icon: `🚂`, add: `to`},
  'ship': {icon: `🛳️`, add: `to`},
  'transport': {icon: `🚊`, add: `to`},
  'drive': {icon: `🚗`, add: `to`},
  'flight': {icon: `✈️`, add: `to`},
  'check-in': {icon: `🏨`, add: `in`},
  'sightseeing': {icon: `🏛️`, add: `in`},
  'restaurant': {icon: `🍴`, add: `in`},
};

export const StatData = [{selector: `.statistic__money`, selectorParent: `.statistic__item--money`, title: `MONEY`, unit: `€`, method: `getPointsMoney`},
  {selector: `.statistic__transport`, selectorParent: `.statistic__item--transport`, title: `TRANSPORT`, unit: `x`, method: `getPointsTransport`},
  {selector: `.statistic__time-spend`, selectorParent: `.statistic__item--time-spend`, title: `TIME-SPEND`, unit: `H`, method: `getPointsTimeSpend`}];

export const NAME_FILTERS = [`everything`, `future`, `past`];
export const NAME_SORTING = [`event`, `time`, `price`, `offers`];

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const createElementControl = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement;
};
