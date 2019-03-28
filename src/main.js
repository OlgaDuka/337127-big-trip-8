import {NAME_FILTERS} from './utils/index';
import Model from './model/model';
// import Controller from './controller';
import API from './api';
import Trip from './view/trip';
import TripOpen from './view/trip-open';
import Filter from './view/filter';
// import Stat from './view/stat';

// const model = new Model();
// const app = new Controller();

const AUTHORIZATION = `Basic dXNfckBgYXuzd27yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const controls = document.querySelector(`.trip-controls`);
export const formFilter = controls.querySelector(`.trip-filter`);
const buttonTable = controls.querySelector(`a[href*=table]`);
const buttonStat = controls.querySelector(`a[href*=stats]`);
const boardTable = document.querySelector(`#table`);
const boardStat = document.querySelector(`#stats`);
export const boardEvents = boardTable.querySelector(`.trip-day__items`);

const fnFilter = {
  'filter-everything': () => {
    return Model.filter((it) => !it.isDeleted);
  },
  'filter-future': () => {
    return Model.filter((it) => (it.day > Date.now()) && !it.isDeleted);
  },
  'filter-past': () => {
    return Model.filter((it) => (it.day < Date.now()) && !it.isDeleted);
  }
};

const renderFilters = (arrFilters) => {
  return arrFilters.map((element) => {
    const filter = new Filter(element);
    formFilter.appendChild(filter.render());
    filter.onFilter = () => {
      filter.checked = !filter.checked;
    };
  });
};

const renderEvents = (points) => {
  boardTable.innerHTML = ``;
  for (const obPoint of points) {
    const point = new Trip(obPoint);
    const pointOpen = new TripOpen(obPoint);

    boardTable.appendChild(point.render());

    point.onClick = () => {
      pointOpen.render();
      boardTable.replaceChild(pointOpen.element, point.element);
      point.unrender();
    };
    pointOpen.onSubmit = (newObject) => {
      Model.updatePoint(obPoint, newObject);

      api.updatePoint({id: obPoint.id, data: obPoint.toRAW()})
        .then((newPoint) => {
          point.update(newPoint);
          point.render();
          boardTable.replaceChild(point.element, pointOpen.element);
          pointOpen.unrender();
        });
    };
    pointOpen.onDelete = (({id}) => {
      api.deletePoint({id})
        .then(() => api.getPoints())
        .then(renderEvents)
        .catch(alert);
    });
    pointOpen.onKeyEsc = () => {
      point.render();
      boardTable.replaceChild(point.element, pointOpen.element);
      pointOpen.unrender();
    };
  }
};

api.getPoints()
  .then((points) => {
    renderEvents(points);
  });

formFilter.addEventListener(`click`, ({target}) => {
  if (target.className === `trip-filter__item` && !target.previousElementSibling.disabled) {
    boardEvents.innerHTML = ``;
    renderEvents(fnFilter[target.previousElementSibling.id]());
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
  /* moneyStat.update(Model, 0);
  transportStat.update(Model, 1);
  timeSpendStat.update(Model, 2); */
});

renderFilters(NAME_FILTERS);
// renderEvents(model.events);

/* const moneyStat = new Stat(Model, 0);
moneyStat.render();
const transportStat = new Stat(Model, 1);
transportStat.render();
const timeSpendStat = new Stat(Model, 2);
timeSpendStat.render(); */
