export default class ModelPoint {
  constructor(data) {
    this._id = data[`id`];
    this._type = data[`type`];
    this._price = data[`base_price`] || ``;
    this._timeStart = data[`date_from`];
    this._timeStop = data[`date_to`];
    this._offers = data[`offers`] || [];
    this._destination = data[`destination`] || [];
    this._isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'base_price': this.price,
      'date_from': this.timeStart,
      'date_to': this.timeStop,
      'offers': this.offers,
      'destination': this.destination,
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
