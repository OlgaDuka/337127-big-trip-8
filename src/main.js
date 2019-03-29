import Model from './model/model';
// import Controller from './controller';
import LoaderData from './loader-data';
import Trip from './view/trip';
import TripOpen from './view/trip-open';
import Filter from './view/filter';
import Stat from './view/stat';

const model = new Model();
// const app = new Controller();
const stat = new Stat();
// const transportStat = new Stat();
// const timeSpendStat = new Stat();
const loaderData = new LoaderData();

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

const renderEvents = (arr) => {
  boardTable.innerHTML = ``;
  for (const obPoint of arr) {
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

      loaderData.updatePoint({id: obPoint.id, data: obPoint.toRAW()})
        .then((newPoint) => {
          point.update(newPoint);
          point.render();
          boardTable.replaceChild(point.element, pointOpen.element);
          pointOpen.unrender();
        });
    };
    pointOpen.onDelete = (({id}) => {
      loaderData.deletePoint({id})
        .then(() => loaderData.getPoints())
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

formFilter.addEventListener(`click`, ({target}) => {
  if (target.className === `trip-filter__item` && !target.previousElementSibling.disabled) {
    boardEvents.innerHTML = ``;
    renderEvents(model.getFilterEvents(target.previousElementSibling.id));
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
  stat.update(model.events, model.stat);
});

loaderData.getPoints()
  .then((points) => {
    model.eventsData = points;
    stat.config = model;
  })
  .then(() => {
    renderFilters(model.filters);
    renderEvents(model.events);
    stat.render();
  });
