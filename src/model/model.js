import * as util from '../utils/index';
import * as cnt from '../constants';

export default class Model {
  constructor() {
    this.events = new Array(cnt.NumConst.START_EVENTS).fill(``).map(() => util.createEvent());
    this.filters = util.NAME_FILTERS;
    this.stat = util.StatData;
  }
}
