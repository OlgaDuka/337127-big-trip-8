import * as util from '../utils/index';

export default class Model {
  constructor() {
    this._events = [];
    this._destinations = [];
    this._offers = [];
    this.filters = util.NAME_FILTERS;
    this.stat = util.StatData;
  }

  set eventsData(data) {
    this._events = data;
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
    const index = this.events.findIndex((it) => it === pointToUpdate);
    this.events[index] = Object.assign({}, pointToUpdate, newPoint);
    return this.events[index];
  }

  deletePoint(pointToDelete) {
    const index = this.events.findIndex((it) => it === pointToDelete);
    this.events[index].isDeleted = true;
    return this.events;
  }

  insertPoint(pointToInsert) {
    this.events.push(pointToInsert);
    const index = this.events.size - 1;
    return this.events[index];
  }
}
