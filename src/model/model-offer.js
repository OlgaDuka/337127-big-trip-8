export default class ModelOffer {
  constructor(data) {
    this.title = data[`name`] || ``;
    this.price = data[`price`] || ``;
  }

  static parseOffer(data) {
    return new ModelOffer(data);
  }

  static parseOffers(data) {
    return data.map(ModelOffer.parseOffer);
  }
}
