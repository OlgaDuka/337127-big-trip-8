import Component from './component.js';
/**
 * @description Класс компонента дня путешествия
 * @export
 * @class TripDay
 * @extends {Component}
 */
export default class TripDay extends Component {
  /**
   * @description Конструктор класса
   * @param {String} data день в формате `DD MMM YY`
   * @member TripDay
   */
  constructor(data) {
    super();
    this._day = data;
  }
  /**
   * @description Геттер - создание шаблона компонента
   * @return {Node} DOM-элемент <template>
   * @member TripDay
   */
  get template() {
    return `<section class="trip-day">
              <article class="trip-day__info">
                <span class="trip-day__caption">Day</span>
                <p class="trip-day__number">${this._getDay()}</p>
                <h2 class="trip-day__title">${this._day.substring(2)}</h2>
              </article>
              <div class="trip-day__items">

              </div>
            </section>`.trim();
  }

  /**
   * @description Выделяет из строки подстроку с цифрой дня
   * @return {String} день в формате `D` или `DD`
   * @member TripDay
   */
  _getDay() {
    return this._day.substring(0, 2)[0] === `0` ? this._day.substring(1, 2) : this._day.substring(0, 2);
  }

  /**
   * @description Обновляет день при изменении даты
   * @param {String} data день в формате `DD MMM YY`
   * @member TripDay
   */
  update(data) {
    this._day = data;
  }
}
