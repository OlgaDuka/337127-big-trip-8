import {NumConst, NAME_FILTERS, getRandomInRange} from './utils/index.js';
import {eventTrip} from './data.js';
import Trip from './trip.js';
import TripOpen from './trip-open.js';
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
  let isOpen = false;
  for (let i = 0; i < arr.length; i += 1) {
    let point = new Trip(arr[i]);
    let pointOpen = new TripOpen(arr[i]);
    dist.appendChild(point.render());
    point.onClick = () => {
      if (!isOpen) {
        pointOpen.render();
        dist.replaceChild(pointOpen.element, point.element);
        point.unrender();
        isOpen = true;
      }
    };
    pointOpen.onSubmit = (newObject) => {
      const data = arr[i];
      data.type = newObject.type;
      data.title = newObject.title;
      data.price = newObject.price;
      data.timeStart = newObject.timeStart;
      data.timeStop = newObject.timeStop;
      //  data.offers = newObject.offers;

      point.update(data);

      point.render();
      dist.replaceChild(point.element, pointOpen.element);
      pointOpen.unrender();
      isOpen = false;
    };
    pointOpen.onDelete = () => {
      pointOpen.unrender();
      arr.splice(i, 1);
      isOpen = false;
    };
    pointOpen.onKeyEsc = () => {
      point.render();
      dist.replaceChild(point.element, pointOpen.element);
      pointOpen.unrender();
      isOpen = false;
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
