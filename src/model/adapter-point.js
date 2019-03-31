export default class AdapterPoint {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.price = data[`base_price`] || ``;
    this.timeStart = data[`date_from`];
    this.timeStop = data[`date_to`];
    this.offers = data[`offers`] || [];
    this.destination = data[`destination`].name || ``;
    this.description = data[`destination`].description || ``;
    this.pictures = data[`destination`].pictures || [];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  static toRAW(data) {
    return {
      'id': data.id,
      'type': data.type,
      'base_price': data.price,
      'date_from': data.timeStart,
      'date_to': data.timeStop,
      'offers': data.offers,
      'destination': {name: data.destination, description: data.description, pictures: data.picture},
      'is_favorite': data.isFavorite
    };
  }

  static parsePoint(data) {
    return new AdapterPoint(data);
  }

  static parsePoints(data) {
    return data.map(AdapterPoint.parsePoint);
  }
}
