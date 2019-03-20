import {NumConst, NAME_FILTERS} from './utils/index.js';
import {eventTrip} from './data.js';
import Trip from './trip.js';
import TripOpen from './trip-open.js';
import Filter from './filter.js';

export const boardEvents = document.querySelector(`.trip-day__items`);
export const formFilter = document.querySelector(`.trip-filter`);

const renderFilters = (arrFilters) => {
  return arrFilters.map((element) => {
    const filter = new Filter(element);
    formFilter.appendChild(filter.render());
    filter.onFilter = () => {
      filter.checked = !filter.checked;
    };
  });
};

const filterEvents = (events, filterName) => {
  let arrResult = [];
  switch (filterName) {
    case `filter-everything`:
      arrResult = arrPoints;
      break;
    case `filter-future`:
      arrResult = arrPoints.filter((it) => it.day > Date.now());
      break;
    case `filter-past`:
      arrResult = arrPoints.filter((it) => it.day < Date.now());
  }
  return arrResult;
};

const createData = (amount) => {
  const array = new Array(amount);
  for (let i = 0; i < amount; i += 1) {
    array[i] = eventTrip();
  }
  return array;
};

const updatePoint = (points, pointToUpdate, newPoint) => {
  const index = points.findIndex((it) => it === pointToUpdate);
  points[index] = Object.assign({}, pointToUpdate, newPoint);
  return points[index];
};

const deletePoint = (points, pointToDelete) => {
  const index = points.findIndex((it) => it === pointToDelete);
  points.splice(index, 1);
  return points;
};

const renderEvents = (dist, arr) => {
  for (const obPoint of arr) {
    const point = new Trip(obPoint);
    const pointOpen = new TripOpen(obPoint);
    dist.appendChild(point.render());
    point.onClick = () => {
      pointOpen.render();
      dist.replaceChild(pointOpen.element, point.element);
      point.unrender();
    };
    pointOpen.onSubmit = (newObject) => {
      const updatedPoint = updatePoint(arr, obPoint, newObject);

      point.update(updatedPoint);

      point.render();
      dist.replaceChild(point.element, pointOpen.element);
      pointOpen.unrender();
    };
    pointOpen.onDelete = () => {
      deletePoint(arr, obPoint);
      dist.removeChild(pointOpen.element);
      pointOpen.unrender();
    };
    pointOpen.onKeyEsc = () => {
      point.render();
      dist.replaceChild(point.element, pointOpen.element);
      pointOpen.unrender();
    };
  }
};

renderFilters(NAME_FILTERS);
const arrPoints = createData(NumConst.START_EVENTS);
renderEvents(boardEvents, arrPoints);

formFilter.onclick = ({target}) => {
  if (target.className === `trip-filter__item` && !target.previousElementSibling.disabled) {
    const filterName = target.previousElementSibling.id;
    boardEvents.innerHTML = ``;
    renderEvents(boardEvents, filterEvents(arrPoints, filterName));
  }
};
