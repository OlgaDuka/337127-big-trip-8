import Component from './component.js';
import {createElementControl} from '../utils/index.js';
/**
 * @description Класс компонента сортировки
 * @export
 * @class Sorting
 * @extends {Component}
 */
export default class Sorting extends Component {
  /**
   * @description Конструктор класса компонета сортировки
   * @param {Array} data Массив данных для сортировки
   * @member Sorting
   */
  constructor(data) {
    super();
    this._name = data;

    this._onSorting = null;

    this._onSortingClick = this._onSortingClick.bind(this);
  }

  /**
   * @description Сеттер обработчика клика по кнопке сортировки
   * @param {Function} fn Функция-обработчик
   * @member Sorting
   */
  set onSorting(fn) {
    this._onSorting = fn;
  }

  /**
   * @description Геттер - создание шаблона с кнопкой сортировки
   * @return {Node} DOM-элемент <template>
   * @member Sorting
   */
  get template() {
    return `<input type="radio" id="sorting-${this._name}" name="sorting" value="${this._name}" ${(this._name === `event`) ? `checked` : ``}>
            <label class="trip-sorting__item trip-sorting__item--${this._name}" for="sorting-${this._name}">${this._name}</label>`;
  }

  /**
   * @description Отрисовка компонента
   * @return {node}
   * @member Sorting
   */
  render() {
    this._element = createElementControl(this.template);
    this.bind();

    return this._element;
  }

  /**
   * @description Создание обработчиков событий компонента
   * @member Sorting
   */
  bind() {
    this._element.addEventListener(`click`, this._onSortingClick);
  }

  /**
   * @description Снятие обработчиков событий компонента
   * @member Sorting
   */
  unbind() {
    this._element.removeEventListener(`click`, this._onSortingClick);
  }

  /**
   * @description Обработчик события `click` компонента
   * @return {Function}
   * @member Sorting
   */
  _onSortingClick() {
    return (typeof this._onSorting === `function`) && this._onSorting();
  }
}
