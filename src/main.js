import {NumConst, NAME_EVENTS, getRandomInRange} from './utils/index.js';
import {renderEvents, boardEvents} from './event.js';
import {renderFilters, formFilter} from './filter.js';


const toggleFilter = (event) => {
  formFilter.querySelector(`input:checked`).checked = false;
  event.target.checked = true;
};

renderFilters(NAME_EVENTS);
renderEvents(NumConst.START_EVENTS);

formFilter.onclick = (event) => {
  if (event.target.className === `trip-filter__item` && !event.target.previousElementSibling.disabled) {
    toggleFilter(event);
    boardEvents.innerHTML = ``;
    renderEvents(getRandomInRange(0, NumConst.MAX_EVENT_IN_FILTER));
  }
};
