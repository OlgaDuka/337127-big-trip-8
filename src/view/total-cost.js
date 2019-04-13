import Component from './component.js';

export default class TotalCost extends Component {
  constructor() {
    super();
    this._cost = 0;
  }

  get template() {
    return `<p class="trip__total">Total:
              <span class="trip__total-cost">&euro;&nbsp;${this._cost}</span>
            </p>`;
  }

  getCostTrip(data) {
    this._cost = data.reduce((acc, point) => acc + TotalCost.getPricePoint(point), 0);
    return this._cost;
  }

  static getPricePoint(point) {
    const totalOffersPrice = point.offers.filter((offer) => offer.accepted === true).reduce((acc, offer) => acc + offer.price, 0);
    return point.price + totalOffersPrice;
  }
}
