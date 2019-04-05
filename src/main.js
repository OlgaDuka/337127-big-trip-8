import Model from './model/model';
// import Controller from './controller';
import LoaderData from './model/loader-data';
import Trip from './view/trip';
import TripOpen from './view/trip-open';
import Filter from './view/filter';
import Sorting from './view/sorting';
import Stat from './view/stat';
import Adapter from './model/adapter';

const model = new Model();
// const app = new Controller();
const stat = new Stat();
const loaderData = new LoaderData();

const controls = document.querySelector(`.trip-controls`);
export const formFilter = controls.querySelector(`.trip-filter`);
const buttonTable = controls.querySelector(`a[href*=table]`);
const buttonStat = controls.querySelector(`a[href*=stats]`);
const boardTable = document.querySelector(`#table`);
const boardStat = document.querySelector(`#stats`);
export const boardEvents = boardTable.querySelector(`.trip-day__items`);
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

const renderEvents = (arr) => {
  boardEvents.innerHTML = ``;
  for (let obPoint of arr) {
    const point = new Trip(obPoint);
    let pointOpen = new TripOpen(obPoint, model.offers, model.destinations);

    boardEvents.appendChild(point.render());

    point.onClick = () => {
      pointOpen.render();
      boardEvents.replaceChild(pointOpen.element, point.element);
      point.unrender();
    };
    pointOpen.onSubmit = (newObject) => {
      pointOpen.blockToSave();
      loaderData.updatePoint({id: obPoint.id, data: Adapter.toRAW(newObject)})
        .then((newPoint) => {
          pointOpen.element.style.border = ``;
          point.update(newPoint);
          point.render();
          boardEvents.replaceChild(point.element, pointOpen.element);
          pointOpen.unrender();
          model.updatePoint(obPoint, newPoint);
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
          pointOpen.element.style.border = ``;
          renderEvents(newArrPoints);
          model.eventsData = newArrPoints;
        })
        .catch(() => {
          pointOpen.element.style.border = `2px solid #FF0000`;
          pointOpen.shake();
          pointOpen.unblockToDelete();
        });
    });
    pointOpen.onKeyEsc = () => {
      point.render();
      boardEvents.replaceChild(point.element, pointOpen.element);
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

formSorting.addEventListener(`click`, ({target}) => {
  const className = target.className;
  const numPos = className.indexOf(` `);
  if (className.substring(0, numPos) === `trip-sorting__item` && !target.previousElementSibling.disabled) {
    boardEvents.innerHTML = ``;
    renderEvents(model.getSortingEvents(target.previousElementSibling.id));
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
  stat.update(model);
});

/* loaderData.getOffers()
  .then((offers) => {
    model.offersData = offers;
    loaderData.getDestinations()
      .then((destinations) => {
        model.destinationsData = destinations;
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
      });
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
  })
  .then(() => {
    loaderData.getOffers()
      .then((offers) => {
        model.offersData = offers;
      })
    .then(() => {
      loaderData.getDestinations()
        .then((destinations) => {
          model.destinationsData = destinations;
        });
    });
  }); */

const initialApp = () => {
  boardEvents.textContent = ``;
  stat.config = model;
  renderFilters(model.filters);
  renderSorting(model.sorting);
  renderEvents(model.events);
  stat.render();
};

/* const makeRequest = async () => {
  boardEvents.textContent = `Loading route...`;
  try {
    model.offersData = await loaderData.getOffers();
    model.destinationsData = await loaderData.getDestinations();
    model.eventsData = await loaderData.getPoints();
    await initialApp();
  } catch (err) {
    boardEvents.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
  }
}; */


const makeRequest = async () => {
  boardEvents.textContent = `Loading route...`;
  try {
    [model.offersData, model.destinationsData, model.eventsData] =
    await Promise.all([loaderData.getOffers(), loaderData.getDestinations(), loaderData.getPoints()]);
    await initialApp();
  } catch (err) {
    boardEvents.textContent = `Something went wrong while loading your route info. Check your connection or try again later`;
  }
};

makeRequest();
