export const NumConst = {
  MAX_EVENT_IN_FILTER: 10,
  START_EVENTS: 7
};

export const Price = {
  MIN_PRICE_EVENT: 20,
  MAX_PRICE_EVENT: 100,
  MIN_PRICE_OFFER: 10,
  MAX_PRICE_OFFER: 200
};

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
  `The provision of international calling cards`,
  `Add insurance`,
  `Booking tickets for events`,
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
