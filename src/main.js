import moment from 'moment';
import Model from './model/model';
import LoaderData from './model/loader-data';
import TotalCost from './view/total-cost';
import TripDay from './view/trip-day';
import Trip from './view/trip';
import TripOpen from './view/trip-open';
import Filter from './view/filter';
import Sorting from './view/sorting';
import Stat from './view/stat';
import Adapter from './model/adapter';

const model = new Model();
const stat = new Stat();
const loaderData = new LoaderData();
const cost = new TotalCost();

const boardTotalCost = document.querySelector(`.trip`);
const controls = document.querySelector(`.trip-controls`);
export const formFilter = controls.querySelector(`.trip-filter`);
const buttonTable = controls.querySelector(`a[href*=table]`);
const buttonStat = controls.querySelector(`a[href*=stats]`);
const buttonNewEvent = controls.querySelector(`.trip-controls__new-event`);
const boardTable = document.querySelector(`#table`);
const boardStat = document.querySelector(`#stats`);
export const boardDays = boardTable.querySelector(`.trip-points`);
export const formSorting = boardTable.querySelector(`.trip-sorting`);

const renderFilters = (arrFilters) => {
  return arrFilters.map((element) => {
    const filter = new Filter(element);
    formFilter.appendChild(filter.render());
    filter.onFilter = () => {
      filter.checked = !filter.checked;
    };
  });
};

const renderSorting = (arrSorting) => {
  return arrSorting.map((element) => {
    const sorting = new Sorting(element);
    formSorting.appendChild(sorting.render());
    sorting.onSorting = () => {
      sorting.checked = !sorting.checked;
    };
  });
};

const renderTotalCost = (arr) => {
  cost.getCostTrim(arr);
  boardTotalCost.appendChild(cost.render());
};

const renderEvents = (arr, dist) => {
  dist.innerHTML = ``;
  for (let obPoint of arr) {
    const point = new Trip(obPoint);
    let pointOpen = new TripOpen(model.offers, model.destinations, obPoint);
    dist.appendChild(point.render());
    point.onClick = () => {
      pointOpen.render();
      dist.replaceChild(pointOpen.element, point.element);
      point.unrender();
    };
    pointOpen.onSubmit = (newObject) => {
      pointOpen.blockToSave();
      loaderData.updatePoint({id: obPoint.id, data: Adapter.toRAW(newObject)})
        .then((newPoint) => {
          pointOpen.element.style.border = ``;
          point.update(newPoint);
          point.render();
          dist.replaceChild(point.element, pointOpen.element);
          pointOpen.unrender();
          model.updatePoint(obPoint, newPoint);
          cost.unrender();
          renderTotalCost(model.events);
        })
        .catch(() => {
          pointOpen.element.style.border = `2px solid #FF0000`;
          pointOpen.shake();
          pointOpen.unblockToSave();
        });
    };
    pointOpen.onDelete = (({id}) => {
      pointOpen.blockToDelete();
      loaderData.deletePoint({id})
        .then(() => loaderData.getPoints())
        .then((newArrPoints) => {
          pointOpen.unrender();
          renderDays(newArrPoints);
          model.eventsData = newArrPoints;
          cost.unrender();
          renderTotalCost(model.events);
        })
        .catch(() => {
          pointOpen.element.style.border = `2px solid #FF0000`;
          pointOpen.shake();
          pointOpen.unblockToDelete();
        });
    });
    pointOpen.onKeyEsc = () => {
      point.render();
      dist.replaceChild(point.element, pointOpen.element);
      pointOpen.unrender();
    };
  }
};

const createArrDays = (arr) => {
  const arrResult = [];
  for (let obPoint of arr) {
    const day = moment(obPoint.timeStart).format(`DD MMMM YY`);
    if (arrResult.indexOf(day) === -1) {
      arrResult.push(day);
    }
  }
  return arrResult;
};

const renderDays = (arr) => {
  const arrDays = createArrDays(arr);
  for (let day of arrDays) {
    const obDay = new TripDay(day);
    const arrResult = arr.filter((it) => moment(it.timeStart).format(`DD MMMM YY`) === day);
    const boardDay = obDay.render();
    boardDays.appendChild(boardDay);
    const distEvents = boardDay.querySelector(`.trip-day__items`);
    renderEvents(arrResult, distEvents);
  }
};

formFilter.addEventListener(`click`, ({target}) => {
  if (target.className === `trip-filter__item` && !target.previousElementSibling.disabled) {
    boardDays.innerHTML = ``;
    renderDays(model.getFilterEvents(target.previousElementSibling.id));
  }
});

formSorting.addEventListener(`click`, ({target}) => {
  const className = target.className;
  const numPos = className.indexOf(` `);
  if (className.substring(0, numPos) === `trip-sorting__item` && !target.previousElementSibling.disabled) {
    boardDays.innerHTML = ``;
    renderDays(model.getSortingEvents(target.previousElementSibling.id));
  }
});

const toggleToTable = () => {
  buttonTable.classList.add(`view-switch__item--active`);
  buttonStat.classList.remove(`view-switch__item--active`);
  boardStat.classList.add(`visually-hidden`);
  boardTable.classList.remove(`visually-hidden`);
};

const toggleToStat = () => {
  buttonStat.classList.add(`view-switch__item--active`);
  buttonTable.classList.remove(`view-switch__item--active`);
  boardStat.classList.remove(`visually-hidden`);
  boardTable.classList.add(`visually-hidden`);
};

buttonTable.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    toggleToTable();
  }
});

buttonStat.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    toggleToStat();
  }
  stat.update(model);
});

const makeRequestInsert = async (newDataPoint, newRenderPoint) => {
  try {
    newRenderPoint.blockToSave();
    await loaderData.createPoint({point: Adapter.toRAW(newDataPoint)});
    model.eventsData = await loaderData.getPoints();
    newRenderPoint.unrender();
    boardDays.innerHTML = ``;
    renderDays(model.events);
    cost.unrender();
    renderTotalCost(model.events);
  } catch (err) {
    newRenderPoint.element.style.border = `2px solid #FF0000`;
    newRenderPoint.shake();
    newRenderPoint.unblockToSave();
  }
};

buttonNewEvent.addEventListener(`click`, () => {
  toggleToTable();
  const newPoint = new TripOpen(model.offers, model.destinations);
  boardDays.insertBefore(newPoint.render(), boardDays.firstChild);
  newPoint.onSubmit = (newObject) => {
    makeRequestInsert(newObject, newPoint);
  };
  newPoint.onKeyEsc = () => {
    newPoint.unrender();
  };
});

const initialApp = () => {
  boardDays.textContent = ``;
  stat.config = model;
  renderTotalCost(model.events);
  renderFilters(model.filters);
  renderSorting(model.sorting);
  renderDays(model.events);
  stat.render();
};

const makeRequest = async () => {
  boardDays.textContent = `Loading route...`;
  try {
    [model.offersData, model.destinationsData, model.eventsData] =
    await Promise.all([loaderData.getOffers(), loaderData.getDestinations(), loaderData.getPoints()]);
    await initialApp();
  } catch (err) {
    boardDays.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
  }
};

makeRequest();
