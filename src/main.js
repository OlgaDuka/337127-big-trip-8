import Model from './model/model';
// import Controller from './controller';
import Trip from './view/trip';
import TripOpen from './view/trip-open';
import Filter from './view/filter';
import Stat from './view/stat';

const model = new Model();
// const app = new Controller();

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
      point.update(model.updatePoint(obPoint, newObject));
      point.render();
      dist.replaceChild(point.element, pointOpen.element);
      pointOpen.unrender();
    };
    pointOpen.onDelete = () => {
      model.deletePoint(obPoint);
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

formFilter.addEventListener(`click`, ({target}) => {
  if (target.className === `trip-filter__item` && !target.previousElementSibling.disabled) {
    boardEvents.innerHTML = ``;
    renderEvents(boardEvents, model.getFilterEvents(target.previousElementSibling.id));
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
  moneyStat.update(model, 0);
  transportStat.update(model, 1);
  timeSpendStat.update(model, 2);
});

renderFilters(model.filters);
renderEvents(boardEvents, model.events);

const moneyStat = new Stat(model, 0);
moneyStat.render();
const transportStat = new Stat(model, 1);
transportStat.render();
const timeSpendStat = new Stat(model, 2);
timeSpendStat.render();
