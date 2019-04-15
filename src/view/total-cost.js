import Component from './component.js';
/**
 * @description Класс компонента стоимости путешествия
 * @export
 * @class TotalCost
 * @extends {Component}
 */
export default class TotalCost extends Component {
  /**
   * @description Конструктор класса
   * @member TotalCost
   */
  constructor() {
    super();
    this._cost = 0;
  }

  /**
   * @description Геттер - создание шаблона компонента
   * @return {Node} DOM-элемент <template>
   * @member TotalCost
   */
  get template() {
    return `<p class="trip__total">Total:
              <span class="trip__total-cost">&euro;&nbsp;${this._cost}</span>
            </p>`;
  }

  /**
   * @description Считает общую стоимость путешествия
   * @return {Integer} стоимость путешествия
   * @member TotalCost
   */
  getCostTrip(data) {
    this._cost = data.reduce((acc, point) => acc + TotalCost.getPricePoint(point), 0);
    return this._cost;
  }

  /**
   * @description Фабричный метод рассчета стоимости точки маршрута с учетом предложений
   * @static
   * @const {Integer} totalOffersPrice стоимость предложений
   * @return {Integer} стоимость точки маршрута
   * @member TotalCost
   */
  static getPricePoint(point) {
    const totalOffersPrice = point.offers.filter((offer) => offer.accepted === true).reduce((acc, offer) => acc + offer.price, 0);
    return point.price + totalOffersPrice;
  }
}
