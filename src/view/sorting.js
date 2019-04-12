import Component from './component.js';
import {createElementControl} from '../utils/index.js';

export default class Sorting extends Component {
  constructor(data) {
    super();
    this._name = data;

    this._onSorting = null;

    this._onSortingClick = this._onSortingClick.bind(this);
  }

  set onSorting(fn) {
    this._onSorting = fn;
  }

  get template() {
    return `<input type="radio" id="sorting-${this._name}" name="sorting" value="${this._name}" ${(this._name === `event`) ? `checked` : ``}>
            <label class="trip-sorting__item trip-sorting__item--${this._name}" for="sorting-${this._name}">${this._name}</label>`;
  }

  render() {
    this._element = createElementControl(this.template);
    this.bind();

    return this._element;
  }

  bind() {
    this._element.addEventListener(`click`, this._onSortingClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onSortingClick);
  }

  _onSortingClick() {
    return (typeof this._onSorting === `function`) && this._onSorting();
  }
}
