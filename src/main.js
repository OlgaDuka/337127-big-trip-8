import Model from './model/model';
// import Controller from './controller';
import LoaderData from './model/loader-data';
import Trip from './view/trip';
import TripOpen from './view/trip-open';
import Filter from './view/filter';
import Stat from './view/stat';
import AdapterPoint from './model/adapter-point';

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
  boardEvents.innerHTML = ``;
  for (let obPoint of arr) {
    const point = new Trip(obPoint);
    const pointOpen = new TripOpen(obPoint, model.offers, model.destinations);

    boardEvents.appendChild(point.render());

    point.onClick = () => {
      pointOpen.render();
      boardEvents.replaceChild(pointOpen.element, point.element);
      point.unrender();
    };
    pointOpen.onSubmit = (newObject) => {
      pointOpen.blockToSave();
      loaderData.updatePoint({id: obPoint.id, data: AdapterPoint.toRAW(newObject)})
        .then((newPoint) => {
          point.update(newPoint);
          point.render();
          boardEvents.replaceChild(point.element, pointOpen.element);
          pointOpen.unrender();
        })
        .then(() => {
          model.updatePoint(obPoint, newObject);
        })
        .catch(() => {
          pointOpen.element.style.border = `2px solid #FF0000`;
          pointOpen.shake();
        })
        .then(() => {
          pointOpen.unblockToSave();
          pointOpen.element.style.border = ``;
        });
    };
    pointOpen.onDelete = (({id}) => {
      pointOpen.blockToDelete();
      loaderData.deletePoint({id})
        .then(() => loaderData.getPoints())
        .then(renderEvents)
        .catch(() => {
          pointOpen.shake();
        })
        .then(() => {
          pointOpen.unblockToDelete();
          pointOpen.element.style.border = ``;
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

const renderApp = () => {
  stat.config = model;
  renderFilters(model.filters);
  renderEvents(model.events);
  stat.render();
};

const makeRequest = async () => {
  boardEvents.innerHTML = `Loading route...`;
  model.offersData = await loaderData.getOffers();
  model.destinationsData = await loaderData.getDestinations();
  model.eventsData = await loaderData.getPoints();
  await renderApp();
};

makeRequest();
