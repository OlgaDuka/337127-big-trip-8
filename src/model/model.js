import * as util from '../utils/index';
import * as cnt from '../constants';

export default class Model {
  constructor() {
    this.events = new Array(cnt.NumConst.START_EVENTS).fill(``).map(() => util.createEvent());
    this.filters = util.NAME_FILTERS;
    this.stat = util.StatData;
  }

  getFilterEvents(filterName) {
    const fnFilter = {
      [`filter-everything`]: () => {
        return this.events;
      },
      [`filter-future`]: () => {
        return this.events.filter((it) => it.day > Date.now());
      },
      [`filter-past`]: () => {
        return this.events.filter((it) => it.day < Date.now());
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
