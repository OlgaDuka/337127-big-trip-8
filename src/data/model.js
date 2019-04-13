import * as util from '../utils/index';
import moment from 'moment';

export default class Model {
  constructor() {
    this._events = [];
    this._destinations = [];
    this._offers = [];
    this.filters = util.NAME_FILTERS;
    this.sorting = util.NAME_SORTING;
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
    const FnFilter = {
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
    return FnFilter[filterName]();
  }

  getSortingEvents(sortingName) {
    let arrResult = this.events.slice();
    const FnSorting = {
      'sorting-event': () => {
        return this.events;
      },
      'sorting-time': () => {
        return arrResult.sort((a, b) => Model.duration(a) - Model.duration(b)).reverse();
      },
      'sorting-price': () => {
        return arrResult.sort((a, b) => a.price - b.price).reverse();
      }
    };
    return FnSorting[sortingName]();
  }

  updatePoint(pointToUpdate, newPoint) {
    const index = pointToUpdate.id;
    this._events[index] = Object.assign({}, newPoint);
    return this._events;
  }

  static duration(obEvent) {
    return moment.duration(moment(obEvent.timeStop).diff(moment(obEvent.timeStart)));
  }
}
