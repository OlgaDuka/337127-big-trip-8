import * as util from '../utils/index';

export default class Model {
  constructor() {
    this._events = [];
    this._destinations = [];
    this._offers = [];
    this.filters = util.NAME_FILTERS;
    this.stat = util.StatData;
    this._state = {
      events: this._events
    };
  }

  set eventsData(data) {
    this._events = data;
    this._state.events = data;
  }

  set destinationsData(data) {
    this._destinations = data;
  }

  set offersData(data) {
    this._offers = data;
  }

  get events() {
    return this._events;
  }

  get destinations() {
    return this._destinations;
  }

  get offers() {
    return this._offers;
  }

  getFilterEvents(filterName) {
    const fnFilter = {
      'filter-everything': () => {
        return this.events;
      },
      'filter-future': () => {
        return this.events.filter((it) => it.timeStart > Date.now());
      },
      'filter-past': () => {
        return this.events.filter((it) => it.timeStop < Date.now());
      }
    };
    return fnFilter[filterName]();
  }

  updatePoint(pointToUpdate, newPoint) {
    const index = this._events.findIndex((it) => it === pointToUpdate);
    this._state.events[index] = Object.assign({}, pointToUpdate, newPoint);
    return this._state;
  }

  deletePoint(pointToDelete) {
    const index = this._events.findIndex((it) => it === pointToDelete);
    this._state.events.splice(index, 1);
    return this._state;
  }

  insertPoint(pointToInsert) {
    this._state.events.push(pointToInsert);
    const index = this._state.events.size - 1;
    return this._state.events[index];
  }

  reset() {
    this._state.events = this._events;
  }

  update() {
    this._events = this._state.events;
  }
}
