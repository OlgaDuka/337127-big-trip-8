export default class ModelOffer {
  constructor(data) {
    this._name = data[`name`] || ``;
    this._price = data[`price`] || ``;
  }

  toRAW() {
    return {
      'name': this.name,
      'price': this.price,
    };
  }

  static parsePoint(data) {
    return new ModelOffer(data);
  }

  static parsePoints(data) {
    return data.map(ModelOffer.parsePoint);
  }
}
