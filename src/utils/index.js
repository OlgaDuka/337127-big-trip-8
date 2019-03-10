export const NumConst = {
  MAX_EVENT_IN_FILTER: 5,
  START_EVENTS: 4
};

export const Price = {
  MIN_PRICE_EVENT: 20,
  MAX_PRICE_EVENT: 100,
  MIN_PRICE_OFFER: 10,
  MAX_PRICE_OFFER: 200
};

const TIME = 86400000; // количество милисекунд в сутках

export const EVENT_TYPES = new Array([
  [`Taxi to Airport`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Ship`, `🛳️`],
  [`Transport`, `🚊`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check in`, `🏨`],
  [`Sightseeing`, `🏛️`],
  [`Restaurant`, `🍴`]
]);

export const OFFER_NAMES = new Set([
  `Add luggage`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`,
  `Get of calling cards`,
  `Add insurance`,
  `Booking ticket for event`,
  `Booking cars`
]);

export const DESTINATIONS = new Set([
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

export const CITY_NAMES = [`Singapore`, `Kuala-Lumpur`, `Manila`, `Karachi`, `Kolombo`, `Muli`, `Lima`, `Hong Kong`, `Macau`, `Dubai`, `Kathmandu`];

export const NAME_FILTERS = [`everything`, `future`, `past`];

export const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
export const getRandomBoolean = () => Boolean(Math.round(Math.random()));
export const getRandomIndexArr = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const getRandomDate = (day) => Date.now() + Math.floor(Math.random() * day) * TIME;
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

export const getTime = (time) => {
  return new Date(time).toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`, hour12: false});
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
