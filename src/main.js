import {NumConst, NAME_FILTERS} from './utils/index';
import {arrTripEvents} from './data';
import Trip from './trip';
import TripOpen from './trip-open';
import Filter from './filter';
import {moneyStat} from './money-stat';
import {transportStat} from './transport-stat';

const controls = document.querySelector(`.trip-controls`);
export const formFilter = controls.querySelector(`.trip-filter`);
const buttonTable = controls.querySelector(`a[href*=table]`);
const buttonStat = controls.querySelector(`a[href*=stats]`);
const boardTable = document.querySelector(`#table`);
const boardStat = document.querySelector(`#stats`);
export const boardEvents = boardTable.querySelector(`.trip-day__items`);


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

formFilter.addEventListener(`click`, ({target}) => {
  if (target.className === `trip-filter__item` && !target.previousElementSibling.disabled) {
    const filterName = target.previousElementSibling.id;
    boardEvents.innerHTML = ``;
    renderEvents(boardEvents, filterEvents(arrPoints, filterName));
  }
});

buttonTable.addEventListener(`click`, ({target}) => {
  if (!target.classList.contains(`view-switch__item--active`)) {
    target.classList.add(`view-switch__item--active`);
    buttonStat.classList.remove(`view-switch__item--active`);
    boardStat.classList.add(`visually-hidden`);
    boardTable.classList.remove(`visually-hidden`);
  }
});

buttonStat.addEventListener(`click`, ({target}) => {
  if (!target.classList.contains(`view-switch__item--active`)) {
    target.classList.add(`view-switch__item--active`);
    buttonTable.classList.remove(`view-switch__item--active`);
    boardStat.classList.remove(`visually-hidden`);
    boardTable.classList.add(`visually-hidden`);
  }
});

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
const arrPoints = arrTripEvents;
renderEvents(boardEvents, arrPoints);

moneyStat.render();
transportStat.render();
