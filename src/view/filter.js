import Component from './component.js';
import {createElementControl} from '../utils/index.js';

/**
 * @description Класс компонента фильтра
 * @export
 * @class Filter
 * @extends {Component}
 */
export default class Filter extends Component {
  /**
   * @description Конструктор класса компонета фильтра
   * @param {Array} data Массив данных фильтров
   * @member Filter
   */
  constructor(data) {
    super();
    this._name = data;

    this._onFilter = null;

    this._onFilterClick = this._onFilterClick.bind(this);
  }

  /**
   * @description Сеттер обработчика клика по фильтру
   * @param {Function} fn Функция-обработчик
   * @member Filter
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * @description Геттер - создание шаблона фильтра
   * @return {Node} DOM-элемент <template> фильтра
   * @member Filter
   */
  get template() {
    return `<input type="radio" id="filter-${this._name}" name="filter" value="${this._name}" ${(this._name === `everything`) ? `checked` : ``}>
            <label class="trip-filter__item" for="filter-${this._name}">${this._name}</label>`;
  }

  /**
   * @description Отрисовка компонента
   * @return {node}
   * @member Filter
   */
  render() {
    this._element = createElementControl(this.template);
    this.bind();

    return this._element;
  }
  /**
   * @description Создание обработчиков событий компонента
   * @member Filter
   */
  bind() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  /**
   * @description Снятие обработчиков событий компонента
   * @member Filter
   */
  unbind() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }

  /**
   * @description Обработчик события `click` компонента
   * @member Filter
   * @return {Function}
   */
  _onFilterClick() {
    return (typeof this._onFilter === `function`) && this._onFilter();
  }
}
