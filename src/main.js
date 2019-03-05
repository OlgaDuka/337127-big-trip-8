import {NumConst, NAME_FILTERS, getRandomInRange} from './utils/index.js';
import {eventTrip} from './data.js';
import {createEvent} from './create-event.js';
import {createFilter} from './create-filter.js';

export const formFilter = document.querySelector(`.trip-filter`);
export const boardEvents = document.querySelector(`.trip-day__items`);

const toggleFilter = (event) => {
  formFilter.querySelector(`input:checked`).checked = false;
  event.target.checked = true;
};

const renderEvents = (num) => {
  for (let i = 0; i < num; i += 1) {
    boardEvents.insertAdjacentHTML(`beforeend`, createEvent(eventTrip()));
  }
};

const renderFilters = (arrFilters) => {
  arrFilters.forEach(function (element) {
    formFilter.insertAdjacentHTML(`beforeend`, createFilter(element));
  });
};

renderFilters(NAME_FILTERS);
renderEvents(NumConst.START_EVENTS);

formFilter.onclick = (event) => {
  if (event.target.className === `trip-filter__item` && !event.target.previousElementSibling.disabled) {
    toggleFilter(event);
    boardEvents.innerHTML = ``;
    renderEvents(getRandomInRange(0, NumConst.MAX_EVENT_IN_FILTER));
  }
};
