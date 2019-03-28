export default class ModelOffer {
  constructor(data) {
    this.name = data[`name`] || ``;
    this.price = data[`price`] || ``;
  }

  static parsePoint(data) {
    return new ModelOffer(data);
  }

  static parsePoints(data) {
    return data.map(ModelOffer.parsePoint);
  }
}
