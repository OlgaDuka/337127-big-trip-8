import Component from './component.js';

export default class TotalCost extends Component {
  constructor() {
    super();
    this._cost = 0;
    this._state = {
      cost: this._cost
    };
  }

  _getPricePoint(point) {
    const offersTotalPrice = point.offers.filter((offer) => offer.accepted === true).reduce((acc, offer) => acc + offer.price, 0);
    return point._price + offersTotalPrice;
  }

  getCostTrim(data) {
    let cost = data.reduce((acc, point) => acc + point.price, 0);
    this._cost = cost;
    return cost;
  }

  get template() {
    return `<p class="trip__total">Total:
              <span class="trip__total-cost">&euro;&nbsp;${this._cost}</span>
            </p>`;
  }
}
