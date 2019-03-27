import Model from './model/model';
// import Controller from './controller';
import API from './api';
import Trip from './view/trip';
import TripOpen from './view/trip-open';
import Filter from './view/filter';
import Stat from './view/stat';

const model = new Model();
// const app = new Controller();

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

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
      model.updatePoint(obPoint, newObject);

      api.updatePoint({id: obPoint.id, data: obPoint.toRAW()})
        .then((newPoint) => {
          point.update(newPoint);
          point.render();
          boardTable.replaceChild(point.element, pointOpen.element);
          pointOpen.unrender();
        });
    };
    pointOpen.onDelete(({id}) => {
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
// renderEvents(model.events);

const moneyStat = new Stat(model, 0);
moneyStat.render();
const transportStat = new Stat(model, 1);
transportStat.render();
const timeSpendStat = new Stat(model, 2);
timeSpendStat.render();
