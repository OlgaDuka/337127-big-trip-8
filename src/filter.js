import Component from './component.js';
import {createFilter} from './utils/index.js';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data;

    this._onFilter = null;

    this._onFilterClick = this._onFilterClick.bind(this);
  }

  _onFilterClick() {
    return (typeof this._onFilter === `function`) && this._onFilter();
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  render() {
    this._element = createFilter(this.template);
    this.bind();

    return this._element;
  }

  bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }

  get template() {
    return `<input type="radio" id="filter-${this._name}" name="filter" value="${this._name}" checked>
            <label class="trip-filter__item" for="filter-${this._name}">${this._name}</label>`;
  }
}
