export const NumConst = {
  MAX_EVENT_IN_FILTER: 10,
  START_EVENTS: 7
};

export const Price = {
  MIN_PRICE_EVENT: 20,
  MAX_PRICE_EVENT: 100,
  MIN_PRICE_SERVICE: 10,
  MAX_PRICE_SERVICE: 200
};

export const NAME_EVENTS = [`everything`, `future`, `past`];

export const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
