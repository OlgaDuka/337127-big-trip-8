import {NumConst, NAME_FILTERS, getRandomInRange} from './utils/index.js';
import {eventTrip} from './data.js';
import {Trip} from './trip.js';
import {TripOpen} from './trip-open.js';
import {renderFilters, formFilter} from './create-filter.js';

export const boardEvents = document.querySelector(`.trip-day__items`);

const toggleFilter = (event) => {
  formFilter.querySelector(`input:checked`).checked = false;
  event.target.checked = true;
};

const createData = (amount) => {
  const array = new Array(amount);
  for (let i = 0; i < amount; i += 1) {
    array[i] = eventTrip();
  }
  return array;
};

const renderEvents = (dist, arr) => {
  for (let i = 0; i < arr.length; i += 1) {
    let point = new Trip(arr[i]);
    let pointOpen = new TripOpen(arr[i]);
    dist.appendChild(point.render());
    point.onClick = () => {
      pointOpen.render();
      dist.replaceChild(pointOpen.element, point.element);
      point.unrender();
    };
  }
};

renderFilters(NAME_FILTERS);
const arrPoints = createData(NumConst.START_EVENTS);
renderEvents(boardEvents, arrPoints);

formFilter.onclick = (event) => {
  if (event.target.className === `trip-filter__item` && !event.target.previousElementSibling.disabled) {
    toggleFilter(event);
    boardEvents.innerHTML = ``;
    const arr = createData(getRandomInRange(0, NumConst.MAX_EVENT_IN_FILTER));
    renderEvents(boardEvents, arr);
  }
};
