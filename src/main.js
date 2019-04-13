import {STORE_KEYS} from './utils/index.js';
import moment from 'moment';
import {Model, LoaderData, Store, Provider, Adapter} from './data/index';
import {TotalCost, TripDay, Trip, TripOpen, Filter, Sorting, Stat} from './view/index';

const model = new Model();
const loaderData = new LoaderData();
const store = new Store({key: STORE_KEYS.points, storage: localStorage});
const provider = new Provider({loaderData, store, generateId: () => String(Date.now())});
const storeOffers = new Store({key: STORE_KEYS.offers, storage: localStorage});
const providerOffers = new Provider({loaderData, store: storeOffers, generateId: () => String(Date.now())});
const storeDestinations = new Store({key: STORE_KEYS.destinations, storage: localStorage});
const providerDestinations = new Provider({loaderData, store: storeDestinations, generateId: () => String(Date.now())});
const stat = new Stat();
const cost = new TotalCost();

const boardTotalCost = document.querySelector(`.trip`);
const controls = document.querySelector(`.trip-controls`);
const formFilter = controls.querySelector(`.trip-filter`);
const buttonTable = controls.querySelector(`a[href*=table]`);
const buttonStat = controls.querySelector(`a[href*=stats]`);
const buttonNewEvent = controls.querySelector(`.trip-controls__new-event`);
const boardTable = document.querySelector(`#table`);
const boardStat = document.querySelector(`#stats`);
const boardDays = boardTable.querySelector(`.trip-points`);
const formSorting = boardTable.querySelector(`.trip-sorting`);

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

const renderTotalCost = (arrPoints) => {
  cost.getCostTrip(arrPoints);
  boardTotalCost.appendChild(cost.render());
};

const updateTotalCost = () => {
  cost.unRender();
  renderTotalCost(model.events);
};

const createArrDays = (arrPoints) => {
  const arrDays = [];
  arrPoints.forEach((point) => {
    const day = moment(point.timeStart).format(`DD MMM YY`);
    if (arrDays.indexOf(day) === -1) {
      arrDays.push(day);
    }
  });
  return arrDays;
};

const renderDays = (arrPoints) => {
  boardDays.innerHTML = ``;
  const arrDays = createArrDays(arrPoints);
  for (let day of arrDays) {
    const arrDayPoints = arrPoints.filter((it) => moment(it.timeStart).format(`DD MMM YY`) === day);
    const boardDay = new TripDay(day).render();
    const distEvents = boardDay.querySelector(`.trip-day__items`);
    boardDays.appendChild(boardDay);
    renderEvents(arrDayPoints, distEvents);
  }
};

const onErrorToRespond = (elem) => {
  elem.element.style.border = `2px solid #FF0000`;
  elem.shake();
  elem.unblockToSave();
};

const makeRequestUpdateData = async (newDataPoint, obPoint, point, pointOpen, container) => {
  try {
    pointOpen.blockToSave();
    const newPoint = await provider.updatePoint({id: obPoint.id, data: Adapter.toRAW(newDataPoint)});
    model.updatePoint(obPoint, newPoint);
    pointOpen.element.style.border = ``;
    point.update(newPoint);
    point.render();
    container.replaceChild(point.element, pointOpen.element);
    pointOpen.unRender();
    updateTotalCost();
  } catch (err) {
    onErrorToRespond(pointOpen);
  }
};

const makeRequestDeleteData = async (id, pointOpen) => {
  try {
    pointOpen.blockToDelete();
    await provider.deletePoint({id});
    model.eventsData = await provider.getPoints();
    pointOpen.unRender();
    renderDays(model.events);
    updateTotalCost();
  } catch (err) {
    onErrorToRespond(pointOpen);
  }
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
      point.unRender();
    };
    pointOpen.onSubmit = (newObject) => {
      makeRequestUpdateData(newObject, obPoint, point, pointOpen, dist);
    };
    pointOpen.onDelete = (({id}) => {
      makeRequestDeleteData(id, pointOpen);
    });
    pointOpen.onKeyEsc = () => {
      point.render();
      dist.replaceChild(point.element, pointOpen.element);
      pointOpen.unRender();
    };
  }
};

const makeRequestInsert = async (newDataPoint, newRenderPoint) => {
  try {
    newRenderPoint.blockToSave();
    await provider.createPoint({point: Adapter.toRAW(newDataPoint)});
    model.eventsData = await provider.getPoints();
    newRenderPoint.unRender();
    boardDays.innerHTML = ``;
    renderDays(model.events);
    updateTotalCost();
  } catch (err) {
    onErrorToRespond(newRenderPoint);
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
    newPoint.unRender();
  };
});

buttonTable.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  formFilter.classList.remove(`visually-hidden`);
  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    toggleToTable();
  }
});

buttonStat.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  formFilter.classList.add(`visually-hidden`);
  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    toggleToStat();
  }
  stat.update(model);
});

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

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncPoints();
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

let makeRequestGetData = async () => {
  let load = true;
  let error = false;
  boardDays.textContent = `Loading route...`;
  try {
    [model.offersData, model.destinationsData, model.eventsData] =
    await Promise.all([providerOffers.getOffers(), providerDestinations.getDestinations(), provider.getPoints()]);
    load = false;
    error = false;
  } catch (err) {
    boardDays.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
  }
  if (!load && !error) {
    initialApp();
  }
};

makeRequestGetData();
