import {STORE_KEYS} from './utils/index.js';
import moment from 'moment';
import {Model, LoaderData, Store, Provider, Adapter} from './data/index';
import {TotalCost, TripDay, Trip, TripOpen, Filter, Sorting, Stat} from './view/index';

/**
 * @description Константы для создания загрузчика данных
 * @const AUTHORIZATION, END_POINT
 * @type {string}
 */
const AUTHORIZATION = `Basic dXNfckBgtXuzd27yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

/**
 * @description Создание объектов, необходимых для запуска приложения
 * @type {Model, LoaderData, Store, Provider, Stat, TotalCost}
 */
const model = new Model();
const loaderData = new LoaderData(END_POINT, AUTHORIZATION);
const store = new Store({key: STORE_KEYS.points, storage: localStorage});
const provider = new Provider({loaderData, store, generateId: () => String(Date.now())});
const storeOffers = new Store({key: STORE_KEYS.offers, storage: localStorage});
const providerOffers = new Provider({loaderData, store: storeOffers, generateId: () => String(Date.now())});
const storeDestinations = new Store({key: STORE_KEYS.destinations, storage: localStorage});
const providerDestinations = new Provider({loaderData, store: storeDestinations, generateId: () => String(Date.now())});
const stat = new Stat();
const cost = new TotalCost();

/**
 * @description Константы для работы с DOM-элементами
 * @type {Node}
 */
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

/**
 * @description Функция переключения страницы на показ списка точек маршрута
 */
const toggleToTable = () => {
  buttonTable.classList.add(`view-switch__item--active`);
  buttonStat.classList.remove(`view-switch__item--active`);
  boardStat.classList.add(`visually-hidden`);
  boardTable.classList.remove(`visually-hidden`);
};

/**
 * @description Функция переключения страницы на показ статистики
 */
const toggleToStat = () => {
  buttonStat.classList.add(`view-switch__item--active`);
  buttonTable.classList.remove(`view-switch__item--active`);
  boardStat.classList.remove(`visually-hidden`);
  boardTable.classList.add(`visually-hidden`);
};

/**
 * @description Функция отрисовки панели фильтров
 * @param {Array} arrFilters массив названий фильтров
 */
const renderFilters = (arrFilters) => {
  return arrFilters.map((element) => {
    const filter = new Filter(element);
    formFilter.appendChild(filter.render());
    filter.onFilter = () => {
      filter.checked = !filter.checked;
    };
  });
};

/**
 * @description Функция отрисовки строки сортировки точек маршрута перед списком точек
 * @param {Array} arrSorting массив названий полей сортировки
 */
const renderSorting = (arrSorting) => {
  return arrSorting.map((element) => {
    const sorting = new Sorting(element);
    formSorting.appendChild(sorting.render());
    sorting.onSorting = () => {
      sorting.checked = !sorting.checked;
    };
  });
};

/**
 * @description Функция отрисовки общей стоимости путешествия
 * @param {Array} arrPoints массив точек маршрута
 */
const renderTotalCost = (arrPoints) => {
  cost.getCostTrip(arrPoints);
  boardTotalCost.appendChild(cost.render());
};

/**
 * @description Функция обновления общей стоимости путешествия
 */
const updateTotalCost = () => {
  cost.unRender();
  renderTotalCost(model.events);
};

/**
 * @description Функция создания массива дней путешествия
 * @param {Array} arrPoints массив точек маршрута
 * @return {Array} arrDays
 */
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

/**
 * @description Функция отрисовки списка точек маршрута, распределенных по дням путешествия
 * @param {Array} arrPoints массив точек маршрута
 */
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

/**
 * @description Функция отрисовки списка точек маршрута, в контейрере первого дня путешествия (для сортировки)
 * @param {Array} arrPoints массив точек маршрута
 */
const renderOneDay = (arrPoints) => {
  let minDay = Date.now();
  arrPoints.forEach((elem) => {
    minDay = elem.timeStart < minDay ? elem.timeStart : minDay;
  });
  minDay = moment(minDay).format(`DD MMM YY`);
  boardDays.innerHTML = ``;
  const boardDay = new TripDay(minDay).render();
  const distEvents = boardDay.querySelector(`.trip-day__items`);
  boardDays.appendChild(boardDay);
  renderEvents(arrPoints, distEvents);
};

/**
 * @description Функция реакции на ошибку при выполнении запросов к серверу
 * @param {Array} elem массив точек маршрута
 */
const respondToError = (elem) => {
  elem.element.style.border = `2px solid #FF0000`;
  elem.shake();
  elem.unblockToSave();
};

/**
 * @description Выполняет запрос к серверу на обновление точки маршрута
 * @param {Object} newDataPoint - новые данные
 * @param {Object} obPoint - данные точки в модели
 * @param {Object} point - объект точки в списке
 * @param {Object} pointOpen - объект точки в режиме редактирования
 * @param {Node} container - контейнер для отрисовки точки маршрута
 */
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
    respondToError(pointOpen);
  }
};

/**
 * @description Выполняет запрос к серверу на удаление точки маршрута
 * @param {String} id - идентификатор точки
 * @param {Object} pointOpen - объект точки в режиме редактирования
 */
const makeRequestDeleteData = async (id, pointOpen) => {
  try {
    pointOpen.blockToDelete();
    await provider.deletePoint({id});
    model.eventsData = await provider.getPoints();
    pointOpen.unRender();
    renderDays(model.events);
    updateTotalCost();
  } catch (err) {
    respondToError(pointOpen);
  }
};

/**
 * @description Отрисовывает точки маршрута и устанавливает для них обработчики событий
 * @param {Array} arrPoint - массив точек маршрута
 * @param {Node} dist - контейнер для отрисовки точки маршрута
 */
const renderEvents = (arrPoint, dist) => {
  dist.innerHTML = ``;
  for (let obPoint of arrPoint) {
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
      pointOpen.resetPoint(obPoint);
      pointOpen.unRender();
    };
  }
};

/**
 * @description Выполняет запрос к серверу на добавление точки маршрута
 * @param {Object} newDataPoint - новые данные
 * @param {Object} newRenderPoint - объект новой точки
 */
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
    respondToError(newRenderPoint);
  }
};

/**
 * @description Установка обработчика события `click` на кнопку NewEvent
 * @const {Object} newPoint - объект TripOpen
 */
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

/**
 * @description Установка обработчика события `click` на кнопку Table
 * @description переключает страницу в режим показа списка точек маршрута
 */
buttonTable.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  formFilter.classList.remove(`visually-hidden`);
  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    toggleToTable();
  }
});

/**
 * @description Установка обработчика события `click` на кнопку Stat
 * @description переключает страницу в режим показа статистики
 */
buttonStat.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  formFilter.classList.add(`visually-hidden`);
  if (!evt.target.classList.contains(`view-switch__item--active`)) {
    toggleToStat();
  }
  stat.update(model);
});

/**
 * @description Установка обработчика события `click` на кнопки панели фильтров
 */
formFilter.addEventListener(`click`, ({target}) => {
  if (target.className === `trip-filter__item` && !target.previousElementSibling.disabled) {
    boardDays.innerHTML = ``;
    model.state.nameFilter = target.previousElementSibling.id;
    renderDays(model.getFilterSortingEvents());
  }
});

/**
 * @description Установка обработчика события `click` на кнопки переключения сортировки
 */
formSorting.addEventListener(`click`, ({target}) => {
  const className = target.className;
  const numPos = className.indexOf(` `);
  if (className.substring(0, numPos) === `trip-sorting__item` && !target.previousElementSibling.disabled) {
    const sortingName = target.previousElementSibling.id;
    if (sortingName !== `sorting-offers`) {
      boardDays.innerHTML = ``;
      model.state.nameSorting = sortingName;
      if (sortingName === `sorting-event`) {
        renderDays(model.getFilterSortingEvents(sortingName));
      } else {
        renderOneDay(model.getFilterSortingEvents(sortingName));
      }
    }
  }
});

/**
 * @description Установка обработчика события `offline` на страницу браузера
 */
window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
/**
 * @description Установка обработчика события `online` на страницу браузера
 */
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncPoints();
});

/**
 * @description Инициализация приложения, отрисовка компонентов страницы после получения данных с сервера
 */
const initialApp = () => {
  boardDays.textContent = ``;
  stat.config = model;
  renderTotalCost(model.events);
  renderFilters(model.filters);
  renderSorting(model.sorting);
  renderDays(model.events);
  stat.render();
};

/**
 * @description Выполняет первоначальный запрос к серверу для получения данных точек маршрута и справочников
 */
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

/**
 * @description Начало: получение данных с сервера и отрисовка страницы приложения.
 */
makeRequestGetData();
