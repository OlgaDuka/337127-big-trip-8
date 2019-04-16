import {createElement} from '../utils/index.js';

/**
 * @description Класс абстрактного компонента, основа для создания view
 * @class Component
 */
export default class Component {
  /**
   * @description Конструктор класса Component
   * @member Component
   */
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }
    this._element = null;
  }

  /**
   * @description Геттер элемента
   * @readonly
   * @member Component
   */
  get element() {
    return this._element;
  }

  /**
   * @description Геттер шаблона элемента
   * @member Component
   */
  get template() {
    throw new Error(`You have to define template.`);
  }

  /**
   * @description Метод отрисовки элемента
   * @return {Node} DOM-элемент
   * @member Component
   */
  render() {
    this._element = createElement(this.template, `div`);
    this.bind();

    return this._element;
  }

  /**
   * @description Очистка свойств и отвязка обработчиков событий элемента
   * @member Component
   */
  unRender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }
  /**
   * @description Установка обработчиков событий
   * @member Component
   */
  bind() {}

  /**
   * @description Снятие обработчиков событий
   * @member Component
   */
  unbind() {}
}
