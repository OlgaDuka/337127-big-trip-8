import {renderEvents, boardEvents} from './event.js';
import {renderFilters, formFilter} from './filter.js';

const Num = {
  MAX_EVENT_IN_FILTER: 10,
  START_EVENTS: 7
};
const NAME_FILTERS = [`everything`, `future`, `past`];

export const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const toggleFilter = (event) => {
  formFilter.querySelector(`input:checked`).checked = false;
  event.target.checked = true;
};

renderFilters(NAME_FILTERS);
renderEvents(Num.START_EVENTS);

formFilter.onclick = (event) => {
  if (event.target.className === `trip-filter__item` && !event.target.previousElementSibling.disabled) {
    toggleFilter(event);
    boardEvents.innerHTML = ``;
    renderEvents(getRandomInRange(0, Num.MAX_EVENT_IN_FILTER));
  }
};
