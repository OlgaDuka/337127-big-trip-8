export default class ModelPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.price = data[`base_price`] || ``;
    this.timeStart = data[`date_from`];
    this.timeStop = data[`date_to`];
    this.offers = data[`offers`] || [];
    this.destination = data[`destination`].name || ``;
    this.description = data[`destination`].description || ``;
    this.picture = data[`destination`].pictures || [];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'base_price': this.price,
      'date_from': this.timeStart,
      'date_to': this.timeStop,
      'offers': this.offers,
      'destination': {name: this.destination, description: this.description, pictures: this.picture},
      'is_favorite': this.isFavorite
    };
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
